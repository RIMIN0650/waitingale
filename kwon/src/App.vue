<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
// ✅ 여기에 import Header, HospitalMap... 다 지우세요!
</script>

<style>
/* 화면 꽉 차게 설정 */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>