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
            :class="selectedCard ? 'bottom-[360px] md:bottom-6 md:right-[410px]' : 'bottom-6 right-6'"
            class="absolute z-[70] w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-300 ease-in-out">
      <i class="fa-solid fa-location-crosshairs text-xl"></i>
    </button>

    <div class="sheet absolute left-0 right-0 bottom-0 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[60]"
         :class="{ open: selectedCard }">
      <div class="glass-strong md:rounded-[28px] rounded-t-[28px] p-5 md:p-6 relative shadow-2xl">
        
        <div class="md:hidden mx-auto mb-3 w-12 h-1.5 rounded-full bg-slate-200"></div>

        <button @click="closeCard" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div v-if="selectedCard" class="fade-in">
          <div class="flex justify-between items-start mb-4 pr-8">
            <div class="min-w-0 flex-1">
              <p class="text-[10px] font-black uppercase tracking-wider mb-1" 
                 :style="{ color: getColorByStatus(selectedCard.status) }">
                {{ selectedCard.status }}
              </p>
              <div class="flex items-center justify-between gap-2 mt-1 mb-1">
                <h4 class="text-xl font-black text-slate-900 leading-tight truncate">
                  {{ selectedCard.name }}
                </h4>
                <button @click.stop="toggleFavorite(selectedCard)" 
                        class="shrink-0 px-3 py-1.5 rounded-full border transition flex items-center gap-1.5"
                        :class="isFavorite(selectedCard) 
                          ? 'bg-rose-50 border-rose-200 text-rose-500' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400'">
                  <i class="text-sm" :class="isFavorite(selectedCard) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                  <span class="text-xs font-bold">찜</span>
                </button>
              </div>

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

<script setup>
import { onMounted, ref, defineExpose, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

// 부모에게서 즐겨찾기 목록 받음
const props = defineProps(['favorites']);
const emit = defineEmits(['update-hospitals', 'toggle-favorite']); // toggle-favorite 이벤트 추가

const mapContainer = ref(null);
const map = ref(null);
const ps = ref(null);
const isLoaded = ref(false);
const overlayList = ref([]);
const myLocationOverlay = ref(null);
const currentPlaces = ref([]); // 줌 변경 시 사용할 현재 데이터

const router = useRouter();

// 필터 상태
const currentRadius = ref(1000);
const filterOpenOnly = ref(false);
const sortMode = ref('distance');
const currentDept = ref('all');
const depts = ['all', '내과', '이비인후과', '정형외과', '소아청소년과', '피부과', '치과'];


// 데이터 상태
const rawData = ref([]); 
const selectedCard = ref(null); // 이게 있어야 카드가 뜹니다!

// 즐겨찾기 상태 변수
const favorites = ref([]);


// === 지도 초기화 ===
onMounted(() => {
  if (!window.kakao || !window.kakao.maps) return;

  // 지도를 그릴 HTML 통이 진짜 있는지 확인 (에러 방지 필수 코드)
  if (!mapContainer.value) {
    console.error("지도를 그릴 영역(mapContainer)을 찾을 수 없습니다.");
    return;
  }

  const options = { center: new window.kakao.maps.LatLng(37.5598, 126.9425), level: 4 };
  map.value = new window.kakao.maps.Map(mapContainer.value, options);
  
  // 줌 제한 설정
  map.value.setMaxLevel(8);
  map.value.setMinLevel(1); 
  
  ps.value = new window.kakao.maps.services.Places();
  
  const zoomControl = new window.kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

  isLoaded.value = true;

  // 줌 변경 시 마커 모양 변경 (점 <-> 핀)
  window.kakao.maps.event.addListener(map.value, 'zoom_changed', function() {
    if(currentPlaces.value && currentPlaces.value.length > 0) {
      displayMarkers(currentPlaces.value);
    }
  });

  // 지도 드래그 시 자동 재검색
  window.kakao.maps.event.addListener(map.value, 'dragend', function() {
    searchPlaces('병원');
  });

  window.addEventListener('resize', () => {
    if (map.value) {
      map.value.relayout();
      const center = map.value.getCenter();
      map.value.setCenter(center);
    }
  });

  // 4. 첫 시작 시 검색
  setTimeout(() => {
    if (map.value) {
      map.value.relayout();
      searchPlaces('병원');
    }
  }, 200);
});


// 즐겨찾기인지 확인 (내 변수가 아니라 props를 봐야 함!)
const isFavorite = (h) => {
  return props.favorites?.some(f => f.id === h.id) || false;
};

// 즐겨찾기 버튼 누르면 부모에게 알림 (이건 완벽합니다!)
const toggleFavorite = (h) => {
  emit('toggle-favorite', h);
};

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
  if (currentDept.value !== 'all') result = result.filter(h => h.dept.includes(currentDept.value));
  if (filterOpenOnly.value) result = result.filter(h => h.isOpen);
  if (sortMode.value === 'distance') result.sort((a,b) => a.distanceValue - b.distanceValue);
  else if (sortMode.value === 'wait') result.sort((a,b) => a.waitTime - b.waitTime);
  else if (sortMode.value === 'status') { const rank = { "원활": 0, "보통": 1, "혼잡": 2 }; result.sort((a,b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9)); }
  displayMarkers(result);
  emit('update-hospitals', result);
};

// 헬퍼 함수들
const setRadius = (r) => { currentRadius.value = r; searchPlaces('병원'); };
const setDept = (d) => { currentDept.value = d; applyFilters(); };

// === 마커 표시 ===
const displayMarkers = (places) => {
  currentPlaces.value = places;
  overlayList.value.forEach(o => o.setMap(null));
  overlayList.value = [];

  // 2. 현재 줌 레벨 확인 (1:가까움 ~ 8:멂)
  const level = map.value.getLevel();
  const isSimpleMode = level >= 6; // 레벨 6 이상이면(축소하면) 심플 모드

  places.forEach(place => {
    const position = new window.kakao.maps.LatLng(place.lat, place.lng);
    const color = getColorByStatus(place.status);

    const content = document.createElement('div');
    content.className = 'overlay-group cursor-pointer';
    
    if (isSimpleMode) {
      // 🔵 [심플 모드] 축소했을 땐 깔끔한 점으로 표시
      content.innerHTML = `
        <div style="
          width: 14px; height: 14px; 
          background: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        </div>
      `;
    } else {
    content.innerHTML = `
      <div class="info-bubble">
        <span style="color:${color}"><i class="fa-solid fa-circle text-[6px]"></i></span>
        <span>대기 ${place.waitCount}</span>
        <span class="text-slate-300 mx-1">|</span>
        <span>${place.distance}</span>
      </div>
      
      <div class="custom-div-icon">
        <div class="pin-marker" style="background:${color}">
          <i class="fa-solid fa-hospital" style="color:#ffffff"></i>
        </div>
      </div>
    `;
    }  
    content.onclick = () => {
       openCard(place);
       // 점 클릭 시 확대
       if(isSimpleMode) map.value.setLevel(4, {animate: true});
    };

    const overlay = new window.kakao.maps.CustomOverlay({
      map: map.value, position, content, yAnchor: isSimpleMode ? 0.5 : 1
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

// src/components/HospitalMap.vue 내부의 panToMyLocation 함수 교체

const panToMyLocation = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((pos) => {
    const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    map.value.panTo(latlng);
    
    // ⭐ [복구완료] 파란색 내 위치 점 그리기
    if (!myLocationOverlay.value) {
      const content = document.createElement('div');
      content.className = 'my-location-pulse'; // index.html에 정의된 파란 점 스타일
      
      myLocationOverlay.value = new window.kakao.maps.CustomOverlay({
        map: map.value,
        position: latlng,
        content: content,
        yAnchor: 0.5, // 점이니까 중앙이 기준
        zIndex: 3 // 마커들보다 아래, 지도보단 위에
      });
    } else {
      // 이미 점이 있다면 위치만 쓱 옮김
      myLocationOverlay.value.setPosition(latlng);
      myLocationOverlay.value.setMap(map.value);
    }

    // 이동한 위치에서 다시 병원 검색
    searchPlaces('병원');
  });
};

// 상세 카드에서 쓰는 기능들
const callHospital = (phone) => alert(`전화 연결: ${phone}`);
const openKakaoWay = (h) => window.open(`https://map.kakao.com/link/to/${h.name},${h.lat},${h.lng}`);
const goToIntake = () => router.push('/intake');

const openCard = (hospital) => {
  selectedCard.value = hospital;
  if(map.value) map.value.panTo(new window.kakao.maps.LatLng(hospital.lat, hospital.lng));
  displayMarkers([hospital]);
};

const closeCard = () => {
  selectedCard.value = null;
  
  // 아까 숨겼던 다른 병원 마커들 다시 지도에 뿌리기
  applyFilters(); 
};

const moveTo = (lat, lng) => {
  if(map.value) map.value.panTo(new window.kakao.maps.LatLng(lat, lng));
};

const resizeMap = () => {
  if (map.value) {
    map.value.relayout(); // 지도를 현재 div 크기에 맞춰 다시 계산
    // 중심점이 엉뚱한 곳으로 튀지 않게 현재 중심 유지
    const center = map.value.getCenter(); 
    map.value.setCenter(center);
  }
};

defineExpose({ searchPlaces, moveTo, openCard, resizeMap });
</script>

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