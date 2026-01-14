// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// import Login from '@/views/Login.vue'
// import Signup from '@/views/Signup.vue'

import index from '@/views/Index.vue'
// import Intake from '../views/Intake.vue'

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


    
    // { path: '/index', component: index },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../views/Index.vue') // 기존 홈
    // },
    // {
    //   path: '/intake',
    //   name: 'intake',
    //   component: Intake
    // }
  ],
})

// 페이지 이름 지정하고 싶을 때
// router.beforeEach((to, from, next) => {
//   console.log('Vue에서 링크를 이동할 때 매번 실행되는 함수')
//   document.title = to.meta.title

//   if (to.meta.requiresAuth) {
//     if (localStorage.getItem('USERINFO') == null) {
//       next({ name: 'login' })
//     }
//   }
//   next()
// })

export default router