<!-- <script setup>
import { ref, onMounted } from 'vue';

defineProps({ hospitals: Array });
defineEmits(['item-click']);

// === 즐겨찾기 로직 (localStorage) ===
const favorites = ref([]);

onMounted(() => {
  const saved = localStorage.getItem('mediq_favorites');
  if(saved) favorites.value = JSON.parse(saved);
});

const isFavorite = (h) => favorites.value.some(f => f.id === h.id);

const toggleFavorite = (h) => {
  const idx = favorites.value.findIndex(f => f.id === h.id);
  if(idx > -1) favorites.value.splice(idx, 1);
  else favorites.value.push(h);
  
  localStorage.setItem('mediq_favorites', JSON.stringify(favorites.value));
};
</script>

<template>
    <div class="hidden md:flex w-[400px] flex-col bg-white border-l border-slate-200 shadow-xl z-10 h-full">
    
    <div class="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-list-ul text-indigo-600"></i> 병원 목록
        </h2>
        <span class="text-xs font-black text-slate-500">{{ hospitals.length }}개 결과</span>
      </div>

      <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-2">
        <h3 class="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
          <i class="fa-solid fa-heart text-rose-500"></i> 즐겨찾기
        </h3>
        <div v-if="favorites.length" class="space-y-1">
          <div v-for="fav in favorites" :key="fav.id" 
               @click="$emit('item-click', fav)"
               class="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition">
            <span class="text-xs font-bold text-slate-700 truncate w-32">{{ fav.name }}</span>
            <span class="text-[10px] text-slate-400">대기 {{ fav.waitTime }}분</span>
          </div>
        </div>
        <p v-else class="text-xs text-slate-400">즐겨찾기한 병원이 없습니다.</p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      <div v-if="hospitals.length === 0" class="text-center py-12 text-slate-400 text-sm">
        <i class="fa-solid fa-map-location-dot text-2xl mb-2 block"></i>
        지도에서 병원을 검색해보세요.
      </div>

      <div v-for="h in hospitals" :key="h.id"
           @click="$emit('item-click', h)"
           class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group">
        
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="min-w-0">
            <h3 class="font-black text-slate-900 text-sm truncate group-hover:text-indigo-600 transition">{{ h.name }}</h3>
            <p class="text-xs text-slate-500 mt-1 truncate">{{ h.dept }}</p>
            <p class="text-[11px] text-slate-400 mt-1 truncate">{{ h.distance }} · {{ h.address }}</p>
          </div>
          
          <div class="flex flex-col items-end gap-1 shrink-0">
            <span v-if="h.isOpen" class="badge bg-emerald-50 text-emerald-700 border-emerald-100">
              {{ h.closingSoon ? '곧 마감' : '영업 중' }}
            </span>
            <span v-else class="badge bg-slate-100 text-slate-500">영업 종료</span>
            
            <button @click.stop="toggleFavorite(h)" class="mt-1">
              <i class="fa-heart text-lg transition" 
                 :class="isFavorite(h) ? 'fa-solid text-rose-500' : 'fa-regular text-slate-300 hover:text-rose-400'"></i>
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-50 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs">
            <span class="w-2.5 h-2.5 rounded-full" 
                  :class="{'bg-emerald-500': h.status==='원활', 'bg-amber-400': h.status==='보통', 'bg-rose-500': h.status==='혼잡'}"></span>
            <span class="font-black text-slate-700">{{ h.status }}</span>
            <span class="text-slate-400">·</span>
            <span class="text-slate-500 font-semibold">대기 {{ h.waitTime }}분</span>
          </div>
          
          <div class="flex gap-2">
             <button class="btn-icon" title="전화"><i class="fa-solid fa-phone"></i></button>
             <button class="btn-icon text-indigo-600 bg-indigo-50" title="길찾기"><i class="fa-solid fa-route"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge { font-size: 10px; font-weight: 800; padding: 3px 6px; border-radius: 6px; border: 1px solid transparent; }
.btn-icon { width: 32px; height: 32px; border-radius: 12px; background: #f1f5f9; color: #64748b; font-size: 11px; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.btn-icon:hover { background: #e2e8f0; }
</style> -->