import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/foodSort',
    name: 'foodSort',
    component: () => import('@/views/FoodSort.vue')
  }, {
    path: '/hotelSort',
    name: 'hotelSort',
    component: () => import('@/views/HotelSort.vue')
  }, {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  }, {
    path: '/',
    redirect: '/foodSort'
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router