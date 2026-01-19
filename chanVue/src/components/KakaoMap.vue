<script setup>
    import { onMounted, ref, defineExpose, defineEmits } from 'vue';


const mapContainer = ref(null);
const map = ref(null);
const ps = ref(null);
const isLoaded = ref(false);
const overlayList = ref([]);
const myLocationOverlay = ref(null);


// 필터 상태
const currentRadius = ref(1000);
const filterOpenOnly = ref(false);
const sortMode = ref('distance');
const currentDept = ref('all');
const depts = ['all', '내과', '이비인후과', '정형외과', '소아청소년과', '피부과', '치과'];


// 데이터 상태
const rawData = ref([]); 
const selectedCard = ref(null); // 이게 있어야 카드가 뜹니다!

const emit = defineEmits(['update-hospitals']);

// === 지도 초기화 ===
onMounted(() => {
  if (!window.kakao || !window.kakao.maps) return;

  const options = { center: new window.kakao.maps.LatLng(37.5598, 126.9425), level: 4 };
  map.value = new window.kakao.maps.Map(mapContainer.value, options);
  ps.value = new window.kakao.maps.services.Places();
  
  const zoomControl = new window.kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

  isLoaded.value = true;
  
  setTimeout(() => {
    map.value.relayout();
    searchPlaces('병원');
  }, 200);
});

// === 증상 변환 함수 ===
const getDepartmentBySymptom = (inputText) => {
  const symptomDB = [
    { keywords: ["배", "복통", "설사", "구토", "체했", "속쓰림"], dept: "내과" },
    { keywords: ["이", "치통", "잇몸", "사랑니"], dept: "치과" },
    { keywords: ["뼈", "골절", "허리", "디스크", "관절"], dept: "정형외과" },
    { keywords: ["코", "목", "귀", "감기", "비염"], dept: "이비인후과" },
    { keywords: ["눈", "시력", "다래끼"], dept: "안과" },
    { keywords: ["피부", "여드름", "두드러기"], dept: "피부과" },
    { keywords: ["아이", "아기", "접종"], dept: "소아청소년과" }
  ];
  for (let item of symptomDB) {
    for (let key of item.keywords) {
      if (inputText.includes(key)) return item.dept;
    }
  }
  return inputText;
};

// === 검색 함수 ===
const searchPlaces = (keyword) => {
  if (!ps.value) return;

  // 1. 상세카드 닫기
  selectedCard.value = null;

  // 2. 증상 변환
  let finalKeyword = keyword;
  const converted = getDepartmentBySymptom(keyword);
  if (converted !== keyword) {
    alert(`"${keyword}" 증상에 맞는 [${converted}]를 검색합니다.`);
    finalKeyword = converted;
  }

  // 3. 카카오 검색
  ps.value.keywordSearch(finalKeyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // 필터링 (HP8 + 동물병원 제외)
      const filteredData = data.filter(place => {
        const isRealHospital = place.category_group_code === 'HP8';
        const isNotAnimal = !place.place_name.includes('동물') && !place.category_name.includes('동물');
        return isRealHospital && isNotAnimal;
      });

      if (filteredData.length === 0) {
        alert('조건에 맞는 병원이 없습니다.');
        return;
      }

      rawData.value = filteredData.map(place => generateRandomData(place));
      applyFilters(); 
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 없습니다.');
    }
  }, {
    location: map.value.getCenter(),
    radius: currentRadius.value,
    sort: window.kakao.maps.services.SortBy.DISTANCE
  });
};

const reSearch = () => searchPlaces('병원');

// === 필터 및 정렬 ===
const applyFilters = () => {
  let result = [...rawData.value];

  if (currentDept.value !== 'all') {
    result = result.filter(h => h.dept.includes(currentDept.value));
  }
  if (filterOpenOnly.value) {
    result = result.filter(h => h.isOpen);
  }

  if (sortMode.value === 'distance') {
    result.sort((a,b) => a.distanceValue - b.distanceValue);
  } else if (sortMode.value === 'wait') {
    result.sort((a,b) => a.waitTime - b.waitTime);
  } else if (sortMode.value === 'status') {
    const rank = { "원활": 0, "보통": 1, "혼잡": 2 };
    result.sort((a,b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
  }

  displayMarkers(result);
  emit('update-hospitals', result);
};

// 헬퍼 함수들
const setRadius = (r) => { currentRadius.value = r; searchPlaces('병원'); };
const setDept = (d) => { currentDept.value = d; applyFilters(); };

// === 마커 표시 ===
const displayMarkers = (places) => {
  overlayList.value.forEach(o => o.setMap(null));
  overlayList.value = [];

  places.forEach(place => {
    const position = new window.kakao.maps.LatLng(place.lat, place.lng);
    const color = getColorByStatus(place.status);

    const content = document.createElement('div');
    content.className = 'overlay-group cursor-pointer';
    content.innerHTML = `
      <div class="info-bubble">
        <span style="color:${color}"><i class="fa-solid fa-circle text-[8px]"></i></span>
        <span>${place.waitTime}분</span>
      </div>
      <div class="custom-div-icon">
      <div class="marker-pin" style="background:${color}"></div>
      <i class="fa-solid fa-hospital marker-icon" style="color:#fff"></i>
      </div>
    `;
    

    content.onclick = () => {
       selectedCard.value = place; // 카드 데이터 채우기
       map.value.panTo(position);  // 지도 이동
    };

    const overlay = new window.kakao.maps.CustomOverlay({
      map: map.value, position, content, yAnchor: 1
    });
    overlayList.value.push(overlay);
  });
};

// 랜덤 데이터 생성
const generateRandomData = (place) => {
  const states = ["원활", "보통", "혼잡"];
  const randomState = states[Math.floor(Math.random() * states.length)];
  
  const categoryName = (place.category_name || '').split(' > ').pop() || "병원";
  let detailDept = categoryName;
  if (categoryName.includes("종합") || categoryName === "병원") {
    detailDept = "내과, 정형외과, 소아청소년과";
  }

  const waitCount = (randomState === "원활") ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 18) + 6;
  const waitTime = waitCount * (randomState === "혼잡" ? 5 : 4);

  return {
    id: place.id,
    name: place.place_name,
    lat: place.y, lng: place.x,
    address: place.road_address_name || place.address_name,
    phone: place.phone || "02-0000-0000",
    distance: place.distance ? place.distance + "m" : "-",
    distanceValue: Number(place.distance || 999999),
    status: randomState,
    waitTime,
    waitCount: waitCount + "명",
    parking: Math.random() > 0.5 ? "여유" : "만차",
    dept: detailDept,
    isOpen: Math.random() > 0.25,
    closingSoon: Math.random() > 0.8
  };
};

const getColorByStatus = (status) => {
  if (status === "원활") return "#10b981";
  if (status === "보통") return "#f59e0b";
  if (status === "혼잡") return "#f43f5e";
  return "#64748b";
};

const panToMyLocation = () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition((pos) => {
    const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    map.value.panTo(latlng);
    searchPlaces('병원');
  });
};

// 상세 카드에서 쓰는 기능들
const callHospital = (phone) => alert(`전화 연결: ${phone}`);
const openKakaoWay = (h) => window.open(`https://map.kakao.com/link/to/${h.name},${h.lat},${h.lng}`);

const openCard = (hospital) => {
  selectedCard.value = hospital;
  if(map.value) map.value.panTo(new window.kakao.maps.LatLng(hospital.lat, hospital.lng));
};

const moveTo = (lat, lng) => {
  if(map.value) map.value.panTo(new window.kakao.maps.LatLng(lat, lng));
};

defineExpose({ searchPlaces, moveTo, openCard });
</script>

<template>
    <div class="w-full h-full relative overflow-hidden">
    <div ref="mapContainer" class="w-full h-full bg-slate-100"></div>
    
    <div v-if="!isLoaded" class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <span class="text-slate-400 font-semibold animate-pulse">지도 로딩 중...</span>
    </div>

    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[50] w-[95%] md:w-[620px]">
      <div class="glass rounded-[28px] p-3 shadow-lg">
        <div class="flex items-center justify-between gap-2 mb-2 overflow-x-auto hide-scroll">
          <div class="seg shrink-0">
            <button v-for="r in [1000, 2000, 5000]" :key="r"
                    @click="setRadius(r)"
                    :class="{ active: currentRadius === r }">
              {{ r / 1000 }}km
            </button>
          </div>
          
          <div class="flex items-center gap-2 shrink-0">
            <button @click="reSearch" class="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-black text-slate-900 hover:bg-slate-50">
              이 주변 재검색
            </button>
            <label class="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-black text-slate-700 cursor-pointer">
              <input type="checkbox" v-model="filterOpenOnly" @change="applyFilters" class="accent-indigo-600">
              영업 중
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[11px] font-black text-slate-500">정렬</span>
            <select v-model="sortMode" @change="applyFilters"
                    class="text-xs font-black bg-white border border-slate-200 rounded-2xl px-2 py-1.5 outline-none shadow-sm">
              <option value="distance">거리순</option>
              <option value="wait">대기짧은순</option>
              <option value="status">혼잡도순</option>
            </select>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto hide-scroll pb-1">
            <button v-for="dept in depts" :key="dept"
                    @click="setDept(dept)"
                    class="chip whitespace-nowrap"
                    :class="{ active: currentDept === dept }">
              {{ dept === 'all' ? '전체' : dept }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button @click="panToMyLocation"
            class="absolute bottom-6 right-6 z-[50] w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition">
      <i class="fa-solid fa-location-crosshairs text-xl"></i>
    </button>

    <div class="sheet absolute left-0 right-0 bottom-0 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[60]"
         :class="{ open: selectedCard }">
      <div class="glass-strong md:rounded-[28px] rounded-t-[28px] p-5 md:p-6 relative shadow-2xl">
        
        <div class="md:hidden mx-auto mb-3 w-12 h-1.5 rounded-full bg-slate-200"></div>

        <button @click="selectedCard = null" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div v-if="selectedCard" class="fade-in">
          <div class="flex justify-between items-start mb-4 pr-8">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-wider mb-1" 
                 :style="{ color: getColorByStatus(selectedCard.status) }">
                {{ selectedCard.status }}
              </p>
              <h4 class="text-xl font-black text-slate-900 leading-tight truncate">{{ selectedCard.name }}</h4>
              <p class="text-xs text-slate-500 mt-1">
                <span class="text-indigo-600 font-bold">{{ selectedCard.dept.split(',')[0] }}</span> | {{ selectedCard.distance }}
              </p>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-center min-w-[80px]">
              <p class="text-[10px] text-slate-500 font-black">대기</p>
              <p class="text-xl font-black text-slate-900">{{ selectedCard.waitTime }}<span class="text-xs">분</span></p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 mb-4">
            <div class="bg-slate-50 px-3 py-2 rounded-2xl flex items-center gap-2 border border-slate-100">
              <i class="fa-solid fa-users text-slate-400 text-xs"></i>
              <p class="text-xs font-black text-slate-700">{{ selectedCard.waitCount }} 대기</p>
            </div>
            <div class="bg-slate-50 px-3 py-2 rounded-2xl flex items-center gap-2 border border-slate-100">
              <i class="fa-solid fa-square-parking text-slate-400 text-xs"></i>
              <p class="text-xs font-black text-slate-700">{{ selectedCard.parking }}</p>
            </div>
            <button @click="callHospital(selectedCard.phone)" class="bg-indigo-600 text-white px-3 py-2 rounded-2xl font-black text-xs hover:bg-indigo-700 flex items-center justify-center gap-2">
              <i class="fa-solid fa-phone"></i> 전화
            </button>
          </div>

          <div class="space-y-2">
            <button @click="openKakaoWay(selectedCard)" class="w-full bg-[#FEE500] text-[#191919] py-3 rounded-2xl font-black hover:bg-yellow-400 flex items-center justify-center gap-2 text-sm">
              <i class="fa-solid fa-route"></i> 길찾기
            </button>
            <button @click="goToIntake" 
                    class="w-full bg-slate-900 text-white py-3 rounded-2xl font-black hover:bg-slate-800 flex items-center justify-center gap-2 text-sm">
              <span>접수/ 예약</span> <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.glass { background: rgba(255,255,255,.90); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.65); }
.glass-strong { background: rgba(255,255,255,.98); backdrop-filter: blur(16px); border: 1px solid rgba(15,23,42,.08); }
.seg { display:flex; gap:6px; background: rgba(15,23,42,.04); padding: 4px; border-radius: 999px; }
.seg button { padding: 6px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; color: rgba(15,23,42,.6); transition: all .2s; }
.seg button.active { background: #fff; color: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
.chip { border: 1px solid rgba(15,23,42,.08); background: #fff; padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; color: rgba(15,23,42,.6); transition: all .2s; }
.chip.active { background: #e0e7ff; border-color: #6366f1; color: #4338ca; }
.sheet { transform: translateY(110%); opacity: 0; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sheet.open { transform: translateY(0); opacity: 1; }
</style>