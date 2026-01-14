<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50">
    
    <LeftSidebar @change-tab="(tab) => currentTab = tab" />

    <div class="flex-1 flex flex-col h-full relative">
      <Header />

      <main class="flex-1 flex relative overflow-hidden">
        
        <div class="flex-1 bg-slate-200 relative">
          <div id="map" class="w-full h-full flex items-center justify-center text-slate-500">
            지도 영역 ({{ currentTab }})
          </div>
        </div>

        <RightSidebar 
          v-if="currentTab === 'hospital'"
          title="병원 목록"
          :items="hospitalData"
          @item-click="handleItemClick"
        />

        <RightSidebar 
          v-if="currentTab === 'pharmacy'"
          title="주변 약국"
          :items="pharmacyData"
          @item-click="handleItemClick"
        />

        </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LeftSidebar from './components/LeftSidebar.vue';      // 아까 만든 왼쪽 메뉴
import Header from './components/Header.vue';        // 상단 헤더
import RightSidebar from './components/RightSidebar.vue'; // 방금 만든 오른쪽 목록

const currentTab = ref('hospital');

// 가짜 데이터들
const hospitalData = ref([
  { id: 1, name: '세브란스 병원', dept: '응급실', waitTime: 30 },
  { id: 2, name: '김내과', dept: '내과', waitTime: 10 },
]);

const pharmacyData = ref([
  { id: 1, name: '온누리 약국', dept: '약국', waitTime: 0 },
  { id: 2, name: '대학 약국', dept: '약국', waitTime: 2 },
]);

const handleItemClick = (item) => {
  alert(`${item.name} 클릭함!`);
}
</script>