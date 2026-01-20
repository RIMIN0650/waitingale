import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/user/Login.vue'
import SignUp from '@/views/user/SignUp.vue'
import HomeView from '@/views/user/HomeView.vue'
import MyPage from '@/views/user/MyPage.vue'
// import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    { path: '/signup', component: SignUp },
    { path: '/login', component: Login },
    { path: '/mypage', component: MyPage },
    // { path : '/index', component:Index },
  ],
})

export default router
