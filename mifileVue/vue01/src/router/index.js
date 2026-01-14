// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// import Login from '@/views/Login.vue'
// import Signup from '@/views/Signup.vue'

import index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: '/login', component: Login },
    //{ name: login,
    // path: '/login',
    // meta: {
    // title:'로그인 페이지',
    // requiresAuth: true
    //},
    // component: Login },
    // { path: '/signup', component: Signup },
    { path: '/index', component: index },
  ],
})

export default router