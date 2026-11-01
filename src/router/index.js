import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/api'

import HomeView from '../views/HomeView.vue'
import OneOfferView from '../views/OneOfferView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import PublishView from '@/views/PublishView.vue'
import BuyView from '@/views/BuyView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({
        min: parseInt(route.query.min) || 0,
        max: parseInt(route.query.max) || 100000,
        sort: parseInt(route.query.sort) || 0,
        search: route.query.search || '',
        page: parseInt(route.query.page) || 1,
      }),
    },
    {
      path: '/offer/:id',
      name: 'offer',
      component: OneOfferView,
      props: true,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/publish',
      name: 'publish',
      component: PublishView,
      meta: { requiredAuth: true },
    },
    {
      path: '/buy/:id',
      name: 'buy',
      component: BuyView,
      props: true,
      meta: { requiredAuth: true },
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: { requiredAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

router.beforeEach(async (to) => {
  if (to.meta.requiredAuth && !getToken()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
