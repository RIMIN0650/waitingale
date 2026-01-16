
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path : '/signup', component: () => import ('@/views/user/SignUp.vue') },
    { path : '/login', component: () => import ('@/views/user/Login.vue') },
    { path : '/mypage', component: () => import ('@/views/user/MyPage.vue' ) },
    { path : '/header', component: () => import ('@/components/Header.vue')},
    { path : '/footer', component: () => import ('@/components/Footer.vue')},
    { path : '/leftsidebar', component: () => import ('@/components/LeftSideBar.vue')},
    { path : '/map', component: () => import ('@/views/map/Map.vue')},
  ],
})

export default router
