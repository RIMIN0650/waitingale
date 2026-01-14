<script setup>

</script>

<template>
<body class="h-full overflow-hidden">
<div class="flex h-full">
  <!-- Left Nav -->
  <div class="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 z-20">
    <div class="h-16 flex items-center px-6 border-b border-slate-100">
      <a href="#" class="flex items-center gap-2">
        <img src="mediQ_logo.png" onerror="this.src='https://via.placeholder.com/32'"
             alt="Logo" class="w-8 h-8 object-contain">
        <span class="text-xl font-black tracking-tight text-slate-900">MediQ</span>
      </a>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <p class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>

      <button onclick="switchTab('hospital')" id="nav-hospital"
              class="w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl transition-all bg-indigo-50 text-indigo-700">
        <i class="fa-solid fa-map-location-dot w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        내 주변 병원
      </button>

      <button onclick="switchTab('pharmacy')" id="nav-pharmacy"
              class="w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
        <i class="fa-solid fa-pills w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        주변 약국
      </button>

      <button onclick="switchTab('reservation')" id="nav-reservation"
              class="w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
        <i class="fa-solid fa-calendar-check w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        나의 예약
        <span class="ml-auto bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-black">1</span>
      </button>

      <div class="pt-6 mt-6 border-t border-slate-100">
        <p class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
        <button class="w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
          <i class="fa-solid fa-user-gear w-6 text-center text-lg mr-2"></i>
          마이페이지
        </button>
      </div>
    </nav>

    <div class="p-4 border-t border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <i class="fa-solid fa-user"></i>
        </div>
        <div>
          <p class="text-sm font-extrabold text-slate-900">게스트</p>
          <a href="login.html" class="text-xs text-indigo-600 hover:underline">로그인하기</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Main -->
  <div class="flex-1 flex flex-col h-full relative">
    <!-- Top Header -->
    <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
      <button class="md:hidden text-slate-500 mr-4">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>

      <div class="flex-1 max-w-xl">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
          </div>

          <input type="text" id="search-keyword"
                 onkeyup="if(window.event.keyCode==13){searchHospitals()}"
                 class="block w-full pl-10 pr-28 py-2.5 border border-slate-200 rounded-2xl bg-white shadow-sm
                        text-slate-900 placeholder-slate-400
                        focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-300 transition
                        sm:text-sm font-semibold"
                 placeholder="증상, 병원명, 진료과 검색 (예: 배아파, 세브란스)">

          <button onclick="searchHospitals()"
                  class="absolute inset-y-0 right-2 my-1.5 px-4 rounded-xl
                         text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
            검색
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 ml-4">
        <button class="text-slate-400 hover:text-slate-600 relative">
          <i class="fa-regular fa-bell text-xl"></i>
          <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-hidden relative bg-slate-50">

      <!-- ====================== HOSPITAL VIEW ====================== -->
      <div id="view-hospital" class="absolute inset-0 flex flex-col md:flex-row">

        <!-- Map Panel -->
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

        <!-- Sidebar -->
        <div id="sidebar"
             class="w-full h-[50%] md:h-full md:w-[440px] bg-white md:border-l border-slate-200 flex flex-col shadow-xl z-10">
          <div class="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <i class="fa-solid fa-list-ul text-indigo-600"></i> 병원 목록
              </h2>
              <span id="result-count" class="text-xs font-black text-slate-500"></span>
            </div>

            <div class="text-xs text-slate-400 mt-1 flex gap-3">
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 원활</span>
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 보통</span>
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 혼잡</span>
            </div>
          </div>

          <div class="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            ...병원 목록 헤더...
          </div>

          <!-- ✅ 여기 추가 -->
          <div id="favorite-section" class="p-4 border-b border-slate-100 bg-white">
            <h3 class="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
              <i class="fa-solid fa-heart text-rose-500"></i> 즐겨찾기
            </h3>
            <div id="favorite-list" class="space-y-2 text-sm text-slate-500">
              <p class="text-xs text-slate-400">즐겨찾기한 병원이 없습니다</p>
            </div>
          </div>


          <div id="sidebar-hospital-list" class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            <div class="text-center py-10 text-slate-400 text-sm">
              <i class="fa-solid fa-map-location-dot text-2xl mb-2 block"></i>
              지도에서 병원을 검색해보세요.
            </div>
          </div>
        </div>
      </div>

      <!-- ====================== PHARMACY VIEW ====================== -->
      <div id="view-pharmacy" class="hidden absolute inset-0 overflow-y-auto p-6 md:p-10">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-black text-slate-900">주변 약국</h2>
              <p class="text-slate-500 text-sm mt-1">현재 운영 중인 약국을 확인하세요.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-5 rounded-[24px] border border-slate-100 hover:shadow-lg transition cursor-pointer flex items-center gap-4">
              <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <i class="fa-solid fa-capsules text-xl"></i>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-base font-black text-slate-900">연세 365 약국</h3>
                  <span class="badge" style="border-color:rgba(16,185,129,.25); color:#047857; background:rgba(16,185,129,.10)">영업 중</span>
                </div>
                <p class="text-xs text-slate-400 mb-2">서울 서대문구 신촌로 123 · 150m</p>
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span><i class="fa-regular fa-clock mr-1"></i> ~ 22:00</span>
                  <span><i class="fa-solid fa-phone mr-1"></i> 02-312-5678</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-5 rounded-[24px] border border-slate-100 hover:shadow-lg transition cursor-pointer flex items-center gap-4">
              <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <i class="fa-solid fa-mortar-pestle text-xl"></i>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <h3 class="text-base font-black text-slate-900">행복한 온누리 약국</h3>
                  <span class="badge" style="border-color:rgba(245,158,11,.25); color:#92400e; background:rgba(245,158,11,.10)">곧 마감</span>
                </div>
                <p class="text-xs text-slate-400 mb-2">서울 서대문구 연희로 88 · 400m</p>
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span><i class="fa-regular fa-clock mr-1"></i> ~ 18:00</span>
                  <span><i class="fa-solid fa-phone mr-1"></i> 02-333-9999</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ====================== RESERVATION VIEW ====================== -->
      <div id="view-reservation" class="hidden absolute inset-0 overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl font-black text-slate-900 mb-6">나의 예약 리포트</h2>

          <div class="bg-white border border-slate-200 rounded-[32px] p-10 text-center shadow-sm">
            <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <i class="fa-solid fa-lock text-2xl"></i>
            </div>
            <h3 class="text-lg font-black text-slate-800 mb-2">로그인이 필요합니다</h3>
            <p class="text-sm text-slate-500 mb-8">실시간 대기 순번 및 예상 시간을 확인하려면 로그인하세요.</p>
            <a href="login.html"
               class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-indigo-700 transition">
              로그인 / 회원가입
            </a>
          </div>
        </div>
      </div>

    </main>
  </div>
</div>
</body>
</template>

<style scoped>

</style>