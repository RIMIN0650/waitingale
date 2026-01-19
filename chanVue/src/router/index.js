
import { createRouter, createWebHistory } from 'vue-router'

import Signup from '@/views/user/SignUp.vue'
import Login from '@/views/user/Login.vue'
import SignUp from '@/views/user/SignUp.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path : '/', name: 'home', component},
    { path : '/signup', component: SignUp },
    { path : '/login', component: () => import ('@/views/user/Login.vue')},
    { path : '/mypage', component: () => import ('@/views/user/MyPage.vue' ) },
    { path : '/header', component: () => import ('@/components/Header.vue')},
    { path : '/footer', component: () => import ('@/components/Footer.vue')},
    { path : '/leftsidebar', component: () => import ('@/components/LeftSideBar.vue')},
    { path : '/map', component: () => import ('@/components/KakaoMap.vue')},
  ],
})

export default router
