import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import Store from '@/store/index.js'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'TopPage',
    meta: {requiresAuth: true},
    component: () => import('../views/TopPage.vue')
  },
  {
    path: '/credit',
    name: 'Credit',
    meta: {requiresAuth: true},
    component: () => import('../views/Credit.vue')
  },
  {
    path: '/notification',
    name: 'Notification',
    meta: {requiresAuth: true},
    component: () => import('../views/Notification.vue')
  },
  {
    path: '/schedule',
    name: 'Schedule',
    meta: {requiresAuth: true},
    component: () => import('../views/Schedule.vue')
  },
  {
    path: '/login',
    name: 'LogIn',
    component: () => import('../views/LogIn.vue')
  },
  {
    path: '/shoplist',
    name: 'ShopList',
    meta: {requiresAuth: true},
    component: () => import('../views/ShopList.vue')
  },
  {
    path: '/report',
    name: 'Report',
    meta: {requiresAuth: true},
    component: () => import('../views/Reports.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !Store.state.userToken) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router
