<script setup>
import { reactive, ref, onMounted } from 'vue'

/* ===============================
   WebSocket
================================ */
const wsUri = 'ws://127.0.0.1:8080/ws/chat'
let websocket = null

const connected = ref(false)
const currentNickname = ref('')

/* ===============================
   병원 데이터
================================ */
const hospitals = reactive({
  hospital1: {
    name: '서면 연세 청소년 소아과',
    queue: []
  }
})

/* ===============================
   WebSocket 연결
================================ */
function connectWebSocket() {
  websocket = new WebSocket(wsUri)

  websocket.onopen = () => {
    connected.value = true
  }

  websocket.onclose = () => {
    connected.value = false
  }

  websocket.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data).payload
      const data = JSON.parse(payload)
      handleQueueUpdate(data)
    } catch (err) {
      console.error('메시지 파싱 오류', err)
    }
  }
}

/* ===============================
   큐 처리
================================ */
function handleQueueUpdate({ action, hospital, nickname, queue }) {
  if (action === 'join') {
    addToQueue(hospital, nickname)
  } else if (action === 'cancel') {
    removeFromQueue(hospital, nickname)
  } else if (action === 'sync' && queue) {
    hospitals[hospital].queue = queue
    updatePositions(hospital)
  }
}

function addToQueue(hospitalId, nickname) {
  const queue = hospitals[hospitalId].queue
  if (queue.some(q => q.nickname === nickname)) return

  queue.push({
    nickname,
    timestamp: new Date().toLocaleTimeString(),
    position: queue.length + 1
  })
}

function removeFromQueue(hospitalId, nickname) {
  const queue = hospitals[hospitalId].queue
  const idx = queue.findIndex(q => q.nickname === nickname)
  if (idx === -1) return

  queue.splice(idx, 1)
  updatePositions(hospitalId)
}

function updatePositions(hospitalId) {
  hospitals[hospitalId].queue.forEach((q, i) => {
    q.position = i + 1
  })
}

/* ===============================
   사용자 상태
================================ */
function myQueue(hospitalId) {
  return hospitals[hospitalId].queue.find(
    q => q.nickname === currentNickname.value
  )
}

function joinQueue(hospitalId) {
  const msg = {
    action: 'join',
    hospital: hospitalId,
    nickname: currentNickname.value
  }
  websocket.send(JSON.stringify(msg))
  addToQueue(hospitalId, currentNickname.value)
}

function cancelQueue(hospitalId) {
  if (!confirm('정말 대기를 취소하시겠습니까?')) return

  const msg = {
    action: 'cancel',
    hospital: hospitalId,
    nickname: currentNickname.value
  }
  websocket.send(JSON.stringify(msg))
  removeFromQueue(hospitalId, currentNickname.value)
}

/* ===============================
   닉네임 등록
================================ */
function setNickname() {
  if (!currentNickname.value.trim()) {
    alert('이름을 입력하세요!')
    return
  }
  alert(`${currentNickname.value}님, 환영합니다!`)
}

/* ===============================
   라이프사이클
================================ */
onMounted(() => {
  connectWebSocket()
})
</script>

<template>
  <div class="status" :class="connected ? 'connected' : 'disconnected'">
    {{ connected ? '✓ 연결됨' : '✗ 연결 끊김' }}
  </div>

  <div class="container">
    <h1>🏥 병원 대기열 시스템</h1>

    <!-- 닉네임 -->
    <div class="nickname-section">
      <h2>사용자 등록</h2>
      <div class="nickname-input-group">
        <input
          type="text"
          v-model="currentNickname"
          :disabled="!!currentNickname"
          placeholder="이름을 입력하세요"
        />
        <button @click="setNickname" :disabled="!!currentNickname">
          등록하기
        </button>
      </div>
    </div>

    <!-- 병원 카드 -->
    <div class="hospitals-grid">
      <div
        v-for="(hospital, id) in hospitals"
        :key="id"
        class="hospital-card"
      >
        <div class="hospital-header">
          <div class="hospital-name">{{ hospital.name }}</div>
          <div class="waiting-count">
            대기 인원: {{ hospital.queue.length }}명
          </div>
        </div>

        <!-- 내 상태 -->
        <div v-if="myQueue(id)" class="my-status">
          <div class="my-position">
            현재 대기 순위: {{ myQueue(id).position }}번
          </div>
        </div>

        <!-- 버튼 -->
        <div class="action-section">
          <button
            class="join-btn"
            v-if="!myQueue(id)"
            :disabled="!currentNickname"
            @click="joinQueue(id)"
          >
            대기열 등록
          </button>

          <button
            class="cancel-btn"
            v-else
            @click="cancelQueue(id)"
          >
            대기 취소
          </button>
        </div>

        <!-- 대기열 -->
        <div class="queue-list">
          <p v-if="hospital.queue.length === 0" class="empty">
            대기 중인 고객이 없습니다
          </p>

          <div
            v-for="q in hospital.queue"
            :key="q.nickname"
            class="queue-item"
            :class="{ 'my-queue': q.nickname === currentNickname }"
          >
            <div class="queue-position">{{ q.position }}</div>
            <div class="queue-nickname">{{ q.nickname }}</div>
            <div class="queue-time">{{ q.timestamp }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<style scoped>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            font-size: 32px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .nickname-section {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            margin-bottom: 30px;
            text-align: center;
        }

        .nickname-section h2 {
            margin-bottom: 15px;
            color: #333;
        }

        .nickname-input-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
        }

        input[type="text"] {
            padding: 12px 16px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            width: 250px;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }

        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .hospitals-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .hospital-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            transition: transform 0.3s;
        }

        .hospital-card:hover {
            transform: translateY(-5px);
        }

        .hospital-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 20px;
        }

        .hospital-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        .waiting-count {
            font-size: 18px;
            color: #667eea;
            font-weight: bold;
        }

        .action-section {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }

        .join-btn {
            width: 100%;
            padding: 15px;
            font-size: 18px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            margin-bottom: 10px;
        }

        .cancel-btn {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }

        .my-status {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            text-align: center;
        }

        .my-position {
            font-size: 20px;
            font-weight: bold;
            color: #856404;
        }

        .queue-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .queue-item {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
        }

        .queue-item:hover {
            background: #e9ecef;
        }

        .queue-item.my-queue {
            background: #d4edda;
            border-left-color: #28a745;
        }

        .queue-position {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 12px;
        }

        .queue-item.my-queue .queue-position {
            background: #28a745;
        }

        .queue-nickname {
            flex: 1;
            font-weight: 500;
            color: #333;
        }

        .queue-time {
            font-size: 12px;
            color: #6c757d;
        }

        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: bold;
            z-index: 1000;
        }

        .status.connected {
            color: #28a745;
        }

        .status.disconnected {
            color: #dc3545;
        }

        @media (max-width: 1200px) {
            .hospitals-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .hospitals-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>    
