// import Index from '@/views/Index.vue'
// import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/index', component:() => import(view/Index.vue)}
  ],
})

export default router
