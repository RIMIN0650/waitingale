// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/user/Login.vue'
import Signup from '@/views/user/Signup.vue'
import HomeView from '@/views/user/HomeView.vue'
import Index from '@/views/Index.vue'
import Reservation from '@/views/user/Reservation.vue'
import PreCheck from '@/views/user/PreCheck.vue'
import Waiting from '@/views/user/Waiting.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/index', component: Index },
    { path: '/reservation', component: Reservation },
    { path: '/precheck', component: PreCheck },
    { path: '/waiting', component: Waiting },


  ],
})

export default router