<template>
  <div class="w-full h-[50%] md:h-full md:w-[440px] bg-white md:border-l border-slate-200 flex flex-col shadow-xl z-10">
    
    <div class="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-list-ul text-indigo-600"></i> 병원 목록
        </h2>
        <span class="text-xs font-black text-slate-500">
          {{ hospitals.length > 0 ? `${hospitals.length}개 결과` : '결과 없음' }}
        </span>
      </div>

      <div class="text-xs text-slate-400 mt-1 flex gap-3">
        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 원활</span>
        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 보통</span>
        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 혼잡</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      
      <div v-if="hospitals.length === 0" class="text-center py-10 text-slate-400 text-sm">
        <i class="fa-solid fa-map-location-dot text-2xl mb-2 block"></i>
        지도에서 병원을 검색해보세요.
      </div>

      <div 
        v-else
        v-for="hospital in hospitals" 
        :key="hospital.id"
        @click="$emit('select-hospital', hospital)"
        class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">
            {{ hospital.name }}
          </h3>
          <button class="text-slate-300 hover:text-rose-400 text-lg">
             <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <div class="text-xs text-indigo-500 font-semibold mb-1">
          {{ hospital.dept }}
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span class="text-slate-500 flex items-center gap-1">
            <span 
              class="w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-emerald-500': hospital.status === '원활',
                'bg-amber-400': hospital.status === '보통',
                'bg-rose-500': hospital.status === '혼잡'
              }"
            ></span>
            {{ hospital.status }}
          </span>
          <span class="font-bold text-slate-700">대기 {{ hospital.waitTime }}분</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// 부모(App.vue)로부터 병원 목록 데이터를 받습니다.
defineProps({
  hospitals: {
    type: Array,
    default: () => []
  }
});

// 병원 클릭 이벤트를 부모에게 전달합니다.
defineEmits(['select-hospital']);
</script>