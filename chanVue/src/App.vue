<script setup>
  import { ref } from 'vue';

</script>

<template>
  <RouterView></RouterView>
  <div class="layout">
    <Header />
    <div class="content">
      <Sidebar />
      <MapArea />
      <HospitalList />
    </div>
  </div>
  
  

</template>

<style scoped>

</style>