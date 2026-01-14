<template>
  <div class="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 z-20">
    <div class="h-16 flex items-center px-6 border-b border-slate-100">
      <span class="text-xl font-black tracking-tight text-slate-900">MediQ</span>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1">
      <p class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
      
      <button @click="$emit('change-tab', 'hospital')" 
              class="w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl bg-indigo-50 text-indigo-700">
        <i class="fa-solid fa-map-location-dot w-6 text-center text-lg mr-2"></i> 내 주변 병원
      </button>

      <button @click="$emit('change-tab', 'pharmacy')"
              class="w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl text-slate-600 hover:bg-slate-50">
        <i class="fa-solid fa-pills w-6 text-center text-lg mr-2"></i> 주변 약국
      </button>
    </nav>
  </div>
</template>