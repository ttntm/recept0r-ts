import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    authRequired?: Boolean,
    menuPosition?: Number,
    menuVisible?: Boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: {
      menuPosition: 1,
      menuVisible: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/About.vue'),
    meta: {
      menuPosition: 4,
      menuVisible: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router