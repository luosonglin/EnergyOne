import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/index.vue')
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('../views/monitor/index.vue')
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/analysis/index.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/report/index.vue')
  },
  {
    path: '/alarm',
    name: 'Alarm',
    component: () => import('../views/alarm/index.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 