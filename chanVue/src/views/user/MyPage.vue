<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 뒤로가기 버튼 (기존 jQuery 클릭 이벤트 동일 동작)
const backToMain = () => {
  location.href = 'index.html'
}

// 기존 데이터 그대로 유지
const medicalHistoryData = [
  {
    hospital: "서울대학교병원",
    department: "내과",
    date: "2023-10-27",
    doctor: "김철수 교수",
    diagnosis: "급성 위염",
    prescription: "위장약 5일분"
  },
  {
    hospital: "세브란스 병원",
    department: "정형외과",
    date: "2023-03-02",
    doctor: "박민준 전문의",
    diagnosis: "발목 염좌",
    prescription: "물리치료 3회"
  }
]

// DOM 렌더링 함수 (기존 innerHTML 방식 유지)
function renderMedicalHistory() {
  const listContainer = document.getElementById('medical-history-list')
  if (!listContainer) return

  listContainer.innerHTML = medicalHistoryData.map(item => `
    <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
      <div class="flex justify-between items-start mb-3">
        <div>
          <span class="text-[10px] font-bold text-rose-500 bg-rose-100/50 px-2 py-1 rounded-md mr-2">${item.department}</span>
          <h5 class="inline font-bold text-slate-800">${item.hospital}</h5>
        </div>
        <span class="text-xs text-slate-400 font-medium">${item.date}</span>
      </div>
      <div class="grid grid-cols-2 gap-y-2 text-sm">
        <div class="text-slate-500">진단명</div>
        <div class="text-slate-800 font-medium">${item.diagnosis}</div>
        <div class="text-slate-500">처방</div>
        <div class="text-slate-800 font-medium text-xs">${item.prescription}</div>
      </div>
    </div>
  `).join('')
}

// 탭 처리 로직 그대로 유지
function showTab(tabId, index) {
  document.querySelectorAll('.tab-content').forEach(content =>
    content.classList.add('hidden')
  )
  document.getElementById('content-' + tabId)?.classList.remove('hidden')

  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.classList.remove('active-btn')
  )
  document.getElementById('btn-' + tabId)?.classList.add('active-btn')

  const container = document.getElementById('tab-container')
  let arrowPos

  if (window.innerWidth < 768) {
    if (index === 1) arrowPos = "25%"
    else if (index === 2) arrowPos = "75%"
    else if (index === 3) arrowPos = "25%"
    else if (index === 4) arrowPos = "75%"
  } else {
    arrowPos = (index * 25 - 12.5) + "%"
  }

  container?.style.setProperty('--arrow-left', arrowPos)

  if (tabId === 'medical-history') {
    renderMedicalHistory()
  }
}

// resize 핸들러 분리
const handleResize = () => {
  const activeBtn = document.querySelector('.tab-btn.active-btn')
  if (!activeBtn) return

  const id = activeBtn.id.replace('btn-', '')
  const indexMap = {
    'medical-history': 1,
    'prescriptions': 2,
    'billing': 3,
    'results': 4
  }

  showTab(id, indexMap[id])
}

// Vue 생명주기 적용
onMounted(() => {
  renderMedicalHistory()
  showTab('medical-history', 1)

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


<template>
<div>
    <main class="max-w-7xl mx-auto px-6 py-10">
        <!-- 상단 헤더 -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <button id="back-to-main-btn" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition shadow-sm">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="text-2xl font-bold">마이페이지</h1>
            </div>
            <button class="text-slate-400 hover:text-indigo-600 transition"><i class="fa-solid fa-gear text-xl"></i></button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- 왼쪽 프로필 사이드바 -->
            <div class="lg:col-span-4 space-y-6">
                <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <div class="relative flex flex-col items-center">
                        <div class="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-lg">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full rounded-full bg-slate-100" alt="profile">
                        </div>
                        <h2 class="text-xl font-bold">김메디 <span class="text-sm font-normal text-slate-400">님</span></h2>
                        <p class="text-sm text-slate-500 mb-6">medi_kim@example.com</p>
                        
                        <div class="grid grid-cols-3 gap-2 w-full text-center mb-6">
                            <div class="bg-slate-50 p-3 rounded-2xl">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">나이</p>
                                <p class="font-bold text-slate-700">28세</p>
                            </div>
                            <div class="bg-slate-50 p-3 rounded-2xl">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">혈액형</p>
                                <p class="font-bold text-slate-700">A+</p>
                            </div>
                            <div class="bg-slate-50 p-3 rounded-2xl">
                                <p class="text-[10px] text-slate-400 uppercase font-bold">성별</p>
                                <p class="font-bold text-slate-700">남성</p>
                            </div>
                        </div>
                        <button class="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition">내 정보 수정</button>
                    </div>
                </div>

                <div class="bg-rose-50 rounded-[32px] p-6 border border-rose-100">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-notes-medical text-rose-500"></i>
                        <h3 class="font-bold text-rose-800">기저질환 및 알러지</h3>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-white text-rose-500 text-xs font-bold rounded-full border border-rose-100 shadow-sm">페니실린 알러지</span>
                        <span class="px-3 py-1 bg-white text-slate-500 text-xs font-bold rounded-full border border-slate-100 shadow-sm">천식(경미)</span>
                    </div>
                </div>

                <button class="w-full py-4 text-slate-400 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-rose-500 transition">
                    <i class="fa-solid fa-right-from-bracket mr-2"></i> 로그아웃
                </button>
            </div>

            <!-- 오른쪽 메인 콘텐츠 -->
            <div class="lg:col-span-8 space-y-10">
                <!-- 1. 내 의료 지갑 섹션 -->
                <section>
                    <h3 class="text-lg font-bold mb-5 px-2 text-slate-800">내 의료 지갑</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <button onclick="showTab('medical-history', 1)" id="btn-medical-history"
                            class="tab-btn bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center gap-3 group text-rose-600 active-btn">
                            <div class="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-heart-pulse text-xl"></i>
                            </div>
                            <span class="text-sm font-bold text-slate-600">진료 기록</span>
                        </button>

                        <button onclick="showTab('prescriptions', 2)" id="btn-prescriptions"
                            class="tab-btn bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center gap-3 group text-indigo-600">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-file-prescription text-xl"></i>
                            </div>
                            <span class="text-sm font-bold text-slate-600">처방전</span>
                        </button>

                        <button onclick="showTab('billing', 3)" id="btn-billing"
                            class="tab-btn bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center gap-3 group text-emerald-600">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-file-invoice-dollar text-xl"></i>
                            </div>
                            <span class="text-sm font-bold text-slate-600">결제/영수증</span>
                        </button>

                        <button onclick="showTab('results', 4)" id="btn-results"
                            class="tab-btn bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center gap-3 group text-amber-600">
                            <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-square-poll-vertical text-xl"></i>
                            </div>
                            <span class="text-sm font-bold text-slate-600">검사 결과</span>
                        </button>
                    </div>

                    <!-- 말풍선 상세 내용 -->
                    <div id="tab-container" class="speech-bubble border border-slate-100 p-8 min-h-[350px]" style="--arrow-left: 12.5%;">
                        <!-- 진료 기록 -->
                        <div id="content-medical-history" class="tab-content">
                            <div class="flex items-center justify-between mb-6">
                                <h4 class="text-xl font-bold flex items-center gap-2 text-rose-600">
                                    <i class="fa-solid fa-heart-pulse"></i> 나의 진료 기록
                                </h4>
                                <span class="text-xs text-slate-400">최근 1년 기준</span>
                            </div>
                            <div id="medical-history-list" class="space-y-4">
                                <!-- JS로 렌더링 -->
                            </div>
                        </div>

                        <!-- 처방전 -->
                        <div id="content-prescriptions" class="tab-content hidden">
                            <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <i class="fa-solid fa-capsules"></i> 발행된 처방전
                            </h4>
                            <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <p class="text-slate-600 text-sm leading-relaxed">
                                    현재 보관된 처방전이 <strong class="text-indigo-600">2건</strong> 있습니다.<br>
                                    약국 제출용 QR 코드를 확인하거나 PDF로 다운로드할 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <!-- 결제/영수증 -->
                        <div id="content-billing" class="tab-content hidden">
                            <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
                                <i class="fa-solid fa-receipt"></i> 결제 내역
                            </h4>
                            <p class="text-slate-600 text-sm">최근 결제 내역: 15,400원 (2023.12.28). 연말정산용 서류 출력이 가능합니다.</p>
                        </div>

                        <!-- 검사 결과 -->
                        <div id="content-results" class="tab-content hidden">
                            <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-amber-600">
                                <i class="fa-solid fa-chart-line"></i> 검사 결과 보고서
                            </h4>
                            <p class="text-slate-600 text-sm">혈액 검사 결과가 업데이트되었습니다. 정상 범위를 벗어난 항목이 1건 있습니다.</p>
                        </div>
                    </div>
                </section>

                <!-- 2. 다음 병원 일정 섹션 -->
                <section>
                    <h3 class="text-lg font-bold mb-4 px-2 flex items-center justify-between">
                        <span>내 다음 병원 일정</span>
                        <a href="#" class="text-xs text-slate-400 hover:text-indigo-600 transition">전체보기</a>
                    </h3>
                    <div class="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
                        <div class="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div class="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                                <span class="text-[10px] font-bold uppercase">11월</span>
                                <span class="text-xl font-bold">15</span>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-900">연세세브란스 (피부과)</h4>
                                <p class="text-xs text-slate-500">정기 레이저 치료 · 오후 04:00</p>
                            </div>
                            <button class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition">
                                <i class="fa-regular fa-calendar-check"></i>
                            </button>
                        </div>

                        <div class="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div class="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl shrink-0">
                                <span class="text-[10px] font-bold uppercase">12월</span>
                                <span class="text-xl font-bold">20</span>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-900">아이사랑 치과</h4>
                                <p class="text-xs text-slate-500">스케일링 예약 · 오전 10:30</p>
                            </div>
                            <button class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition">
                                <i class="fa-regular fa-calendar-check"></i>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- 3. 가족 구성원 관리 섹션 -->
                <section>
                    <h3 class="text-lg font-bold mb-4 px-2">가족 구성원 관리</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
                            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👶</div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <h4 class="font-bold text-slate-900">김하늘</h4>
                                    <span class="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">진료 중</span>
                                </div>
                                <p class="text-xs text-slate-500">아이사랑 소아과</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
                        </div>

                        <div class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
                            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👩</div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <h4 class="font-bold text-slate-900">이영희</h4>
                                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">건강함</span>
                                </div>
                                <p class="text-xs text-slate-500">최근 진료: 3개월 전</p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
                        </div>

                        <button class="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition min-h-[88px]">
                            <i class="fa-solid fa-plus"></i>
                            <span class="text-sm font-bold">가족 추가하기</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </main>
</div>

</template>

<style scoped>

    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap');
        body { font-family: 'Pretendard', sans-serif; background-color: #f8fafc; color: #1e293b; }
        
        /* 말풍선 꼬리 효과를 위한 커스텀 스타일 */
        .speech-bubble {
            position: relative;
            background: white;
            border-radius: 2rem;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
        }
        .speech-bubble::before {
            content: '';
            position: absolute;
            top: -10px;
            left: var(--arrow-left, 12.5%);
            transform: translateX(-50%);
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 12px solid white;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* 활성화된 버튼 스타일 */
        .active-btn {
            border-color: currentColor !important;
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
            background-color: #fdfdfd;
        }
        .tab-btn {
            transition: all 0.3s ease;
        }
</style>