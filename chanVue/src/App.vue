<script setup>
  import { RouterView } from 'vue-router';
// import LeftSideBar from './components/LeftSideBar.vue';
// import Header from './components/Header.vue';
// import KakaoMap from './components/KakaoMap.vue';
// import RightSideBar from './components/RightSideBar.vue';

// const currentTab = ref('hospital');
// const hospitals = ref([]); // 검색된 병원 목록 데이터
// const mapRef = ref(null);  // 자식 컴포넌트(지도)를 조종하기 위한 변수

// // 1. 헤더에서 검색어가 오면 -> 지도의 검색 함수 실행
// const handleSearch = (keyword) => {
//   if(mapRef.value) {
//     mapRef.value.searchPlaces(keyword);
//   }
// };

// // 2. 지도에서 데이터가 오면 -> 리스트 업데이트
// const updateList = (data) => {
//   hospitals.value = data;
// };

// // 3. 리스트 클릭 시 -> 지도 이동 (구현 예정)
// const focusHospital = (hospital) => {
//   if(mapRef.value) {
//     mapRef.value.openCard(hospital);
//   }
// };
</script>

<template>
  <RouterView></RouterView>

  <!--라우터 뷰를 띄워줬는데 그 밑에 이 내용이 있으니까 갑자기 라우터 뷰 밑으로 아래 내용들이 뜸-->
  <!-- <div class="flex h-full w-full overflow-hidden bg-slate-50">
    
    <LeftSideBar @change-tab="currentTab = $event" />

    <div class="flex-1 flex flex-col h-full relative">
      <Header @search="handleSearch" />

      <main class="flex-1 flex relative overflow-hidden">
        
        <template v-if="currentTab === 'hospital'">
          
          <div class="flex-1 bg-slate-200 relative z-0">
             <KakaoMap ref="mapRef" @update-hospitals="updateList" />
          </div>

          <RightSideBar :hospitals="hospitals" @item-click="focusHospital" />
          
        </template>

        <div v-else class="p-10 w-full">
          <h2 class="text-2xl font-black">준비 중인 화면입니다 ({ { currentTab } })</h2>
        </div>

      </main>
    </div>
  </div> -->

</template>

<style scoped>

</style>