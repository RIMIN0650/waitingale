import { createRouter, createWebHistory } from 'vue-router'

import PreCheck from '@/views/user/PreCheck.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/preCheck',
      name: 'PreCheck',
      component: PreCheck,
    },
  ],
})

export default router
