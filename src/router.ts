import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { store } from './store'

import { showWindow } from './utils'

declare module 'vue-router' {
  interface RouteMeta {
    authRequired?: boolean,
    menuPosition?: number,
    menuVisible?: boolean,
    mode?: string
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
    path: '/create',
    name: 'Add Recipe',
    component: () => import('./views/RecipeEditable.vue'),
    meta: {
      authRequired: true,
      menuPosition: 2,
      menuVisible: true,
      mode: 'create'
    }
  },
  {
    path: '/my-recipes',
    name: 'My Recipes',
    component: () => import('./views/UserRecipes.vue'),
    meta: {
      authRequired: true,
      menuPosition: 3,
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
  },
  {
    path: '/recipe/:id/:refId',
    name: 'Recipe',
    component: () => import('./views/RecipeReadonly.vue'),
    meta: {
      menuVisible: false
    }
  },
  {
    path: '/edit/:refId',
    name: 'Edit Recipe',
    component: () => import('./views/RecipeEditable.vue'),
    meta: {
      authRequired: true,
      menuVisible: false,
      mode: 'edit'
    }
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    redirect: { name: 'Home' },
    meta: {
      menuVisible: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // close open windows
  showWindow(0)
  // global navigation guard for all routes that require user authentication
  if (!to.meta.authRequired) return next()

  if (to.meta.authRequired && store.getters['user/loggedIn']) {
    return next()
  } else {
    router.push({ name: 'Home' })
  }
})

export default router