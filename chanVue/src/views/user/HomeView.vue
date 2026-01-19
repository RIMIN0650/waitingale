<template>
    <div class="flex-1 flex flex-col h-full relative">
      <Header @search="handleSearch" />

        <div class="flex h-screen w-screen overflow-hidden bg-slate-50">
            <LeftSideBar />

      <main class="flex-1 flex relative overflow-hidden">
        
        <div class="flex-1 bg-slate-100 relative z-0 transition-all duration-300">
          <HospitalMap 
            ref="mapRef" 
            :favorites="favorites" 
            @update-hospitals="updateList" 
            @toggle-favorite="handleToggleFavorite" 
          />

          <button v-if="!isListOpen" 
                  @click="isListOpen = true"
                  class="absolute top-4 right-4 z-[50] bg-white border border-slate-200 text-slate-700 
                         px-4 py-2.5 rounded-xl shadow-lg font-bold text-sm hover:bg-slate-50 transition flex items-center gap-2">
            <i class="fa-solid fa-list-ul text-indigo-600"></i> 목록 보기
          </button>
        </div>
        
        <transition name="slide-fade">
          <HospitalList 
            v-show="isListOpen"
            :hospitals="hospitals" 
            :favorites="favorites"
            @item-click="focusHospital" 
            @toggle-favorite="handleToggleFavorite" 
            @close-list="isListOpen = false" 
          />
        </transition>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import LeftSideBar from '@/components/LeftSideBar.vue'; 
import Header from '@/components/Header.vue';
import HospitalMap from '@/components/HospitalMap.vue';
import HospitalList from '@/components/HospitalList.vue';

const hospitals = ref([]);
const favorites = ref([]);
const mapRef = ref(null);

// ✅ [추가] 리스트 열림/닫힘 상태 (기본값: 열림)
const isListOpen = ref(true);

onMounted(() => {
  const saved = localStorage.getItem('mediq_favorites');
  if (saved) {
    favorites.value = JSON.parse(saved);
  }
});

const handleToggleFavorite = (hospital) => {
  const idx = favorites.value.findIndex(f => f.id === hospital.id);
  if (idx > -1) {
    favorites.value.splice(idx, 1);
  } else {
    favorites.value.push(hospital);
  }
  localStorage.setItem('mediq_favorites', JSON.stringify(favorites.value));
};

const handleSearch = (keyword) => {
  if(mapRef.value) mapRef.value.searchPlaces(keyword);
  // 검색하면 리스트가 자동으로 열리게 하면 편합니다.
  isListOpen.value = true;
};

const updateList = (data) => {
  hospitals.value = data;
};

const focusHospital = (hospital) => {
  if(mapRef.value) mapRef.value.openCard(hospital);
};

watch(isListOpen, () => {
  setTimeout(() => {
    if (mapRef.value) {
      mapRef.value.resizeMap();
    }
  }, 380);
});
</script>

<style scoped>
/* 리스트가 스르륵 사라지는 애니메이션 효과 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
  width: 0;
}
</style>