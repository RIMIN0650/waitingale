<script setup>
import { ref, onMounted } from 'vue'

const mapRef = ref(null)
let map = null

onMounted(() => {
  const mapContainer = mapRef.value

  if (mapContainer) {
    const MY_LOCATION = [37.5598, 126.9425] // 신촌

    map = L.map(mapContainer, { zoomControl: false })
      .setView(MY_LOCATION, 15)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map)

    // 내 위치 마커
    const myIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="my-location-pulse"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
    L.marker(MY_LOCATION, { icon: myIcon })
      .addTo(map)
      .bindPopup('<b>현재 위치</b>')

    // 병원 데이터 예시
    const hospitals = [
      { lat: 37.5623, lng: 126.9366, color: "#10b981", icon: "fa-solid fa-hospital" },
      { lat: 37.5640, lng: 126.9400, color: "#f59e0b", icon: "fa-solid fa-child-reaching" },
      { lat: 37.5580, lng: 126.9380, color: "#f43f5e", icon: "fa-solid fa-truck-medical" }
    ]

    hospitals.forEach(h => {
      const iconHtml = `
        <div style="background-color:${h.color};" class="marker-pin"></div>
        <i class="${h.icon} marker-icon" style="color:${h.color};"></i>
      `
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: iconHtml,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      })
      L.marker([h.lat, h.lng], { icon: customIcon }).addTo(map)
    })

    // 내 위치로 이동 버튼 (기존 window 함수와 동일 기능)
    const panToMyLocation = () => {
      map.setView(MY_LOCATION, 15, { animate: true })
    }

    // 템플릿에서 쓸 수 있게 노출
    Object.assign(window, { panToMyLocation })
  }
})

</script>

<template>
    <div id="map" ref="mapRef" class="w-full h-full"></div>
        <div class="relative w-full h-[50%] md:h-full md:flex-1 bg-slate-200 z-0">
          <div id="map" class="w-full h-full"></div>

          <!-- Map: My location -->
          <button onclick="panToMyLocation()"
                  class="absolute top-4 right-4 z-[60] w-11 h-11 bg-white rounded-full shadow-lg
                         flex items-center justify-center text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition
                         border border-slate-100"
                  title="내 위치로 이동">
            <i class="fa-solid fa-location-crosshairs text-lg"></i>
          </button>

          <!-- ✅ Premium Control Panel -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[59] w-[92%] md:w-[620px]">
            <div class="glass rounded-[28px] p-3">
              <div class="flex items-center justify-between gap-2">
                <!-- radius seg -->
                <div class="seg">
                  <button class="active" data-radius="1000" onclick="setRadius(1000)">1km</button>
                  <button data-radius="2000" onclick="setRadius(2000)">2km</button>
                  <button data-radius="5000" onclick="setRadius(5000)">5km</button>
                </div>

                <div class="flex items-center gap-2">
                  <button onclick="searchHospitals('병원')"
                          class="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm
                                 text-xs font-black text-slate-900 hover:bg-slate-50 transition">
                    이 주변 재검색
                  </button>

                  <label class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-black text-slate-700">
                    <input id="toggle-open-only" type="checkbox" class="accent-indigo-600" onchange="applyFiltersAndRender()">
                    영업 중
                  </label>
                </div>
              </div>

              <div class="mt-2 flex items-center justify-between gap-2">
                <!-- sort -->
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-black text-slate-500">정렬</span>
                  <select id="sort-mode" onchange="applyFiltersAndRender()"
                          class="text-xs font-black bg-white border border-slate-200 rounded-2xl px-3 py-2 outline-none shadow-sm">
                    <option value="distance">거리순</option>
                    <option value="wait">대기짧은순</option>
                    <option value="status">혼잡도순</option>
                  </select>
                </div>

                <!-- dept chips -->
                <div class="flex items-center gap-1.5 overflow-x-auto hide-scroll">
                  <button class="chip active" data-dept="all" onclick="setDept('all')">전체</button>
                  <button class="chip" data-dept="내과" onclick="setDept('내과')">내과</button>
                  <button class="chip" data-dept="이비인후과" onclick="setDept('이비인후과')">이비인후과</button>
                  <button class="chip" data-dept="정형외과" onclick="setDept('정형외과')">정형외과</button>
                  <button class="chip" data-dept="소아청소년과" onclick="setDept('소아청소년과')">소아</button>
                  <button class="chip" data-dept="피부과" onclick="setDept('피부과')">피부</button>
                  <button class="chip" data-dept="치과" onclick="setDept('치과')">치과</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Bottom Sheet -->
          <div id="hospital-sheet"
               class="sheet absolute left-0 right-0 bottom-0 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[80]">
            <div class="glass-strong md:rounded-[28px] rounded-t-[28px] p-5 md:p-6 relative">
              <div class="md:hidden mx-auto mb-3 w-12 h-1.5 rounded-full bg-slate-200"></div>

              <button onclick="closeHospitalCard()"
                      class="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>

              <div id="card-content" class="fade-in">
                <div class="flex justify-between items-start mb-4 pr-8">
                  <div class="min-w-0">
                    <p class="text-[10px] font-black uppercase tracking-[0.18em]" id="card-status-text">원활</p>
                    <h4 class="text-xl font-black text-slate-900 leading-tight truncate" id="card-name">병원명</h4>
                    <p class="text-xs text-slate-500 mt-1" id="card-distance">거리</p>
                  </div>

                  <div class="bg-slate-50 border border-slate-200/70 p-2.5 rounded-2xl text-center min-w-[84px] shadow-sm">
                    <p class="text-[10px] text-slate-500 font-black">대기</p>
                    <p class="text-xl font-black text-slate-900" id="card-wait-time">0<span class="text-xs font-semibold">분</span></p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2 mb-4">
                  <div class="bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-2xl flex items-center gap-2">
                    <i class="fa-solid fa-users text-slate-400 text-xs"></i>
                    <p class="text-xs font-black text-slate-700"><span id="card-wait-count">-</span> 대기</p>
                  </div>
                  <div class="bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-2xl flex items-center gap-2">
                    <i class="fa-solid fa-square-parking text-slate-400 text-xs"></i>
                    <p class="text-xs font-black text-slate-700" id="card-parking">-</p>
                  </div>
                  <button id="card-call"
                          class="bg-indigo-600 text-white px-3 py-2 rounded-2xl font-black text-xs hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2">
                    <i class="fa-solid fa-phone"></i> 전화
                  </button>
                </div>

                <div class="space-y-2">
                  <button id="btn-find-way"
                          class="w-full bg-[#FEE500] text-[#191919] py-3 rounded-2xl font-black hover:bg-yellow-400 transition shadow-sm flex items-center justify-center gap-2 text-sm">
                    <i class="fa-solid fa-route"></i> 카카오맵 길찾기
                  </button>
                  <a href="questionnaire.html"
                     class="w-full bg-slate-900 text-white py-3 rounded-2xl font-black hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2 text-sm">
                    <span>접수/예약</span> <i class="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                </div>

                <p class="mt-3 text-[11px] text-slate-400 font-semibold">
                  * 대기/혼잡 정보는 데모 데이터입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
</template>

<style scoped>

</style>