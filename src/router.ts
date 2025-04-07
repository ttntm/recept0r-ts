import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { store } from '@/store'

import { showWindow } from '@/utils'

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
    name: 'Recipes',
    component: () => import('@/views/Home.vue'),
    meta: {
      menuPosition: 1,
      menuVisible: true
    }
  },
  {
    path: '/create',
    name: 'Add Recipe',
    component: () => import('@/views/RecipeEditable.vue'),
    meta: {
      authRequired: true,
      menuPosition: 2,
      menuVisible: true,
      mode: 'create'
    }
  },
  {
    path: '/edit-mode',
    name: 'Edit Mode',
    component: () => import('@/views/UserRecipes.vue'),
    meta: {
      authRequired: true,
      menuPosition: 3,
      menuVisible: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      menuPosition: 4,
      menuVisible: true
    }
  },
  {
    path: '/me',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      authRequired: true,
      menuVisible: false
    }
  },
  {
    path: '/recipe/:slug/:id',
    name: 'Recipe',
    component: () => import('@/views/RecipeReadonly.vue'),
    meta: {
      menuVisible: false
    }
  },
  {
    path: '/edit/:id',
    name: 'Edit Recipe',
    component: () => import('@/views/RecipeEditable.vue'),
    meta: {
      authRequired: true,
      menuVisible: false,
      mode: 'edit'
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/Signup.vue'),
    meta: {
      menuVisible: false
    },
    beforeEnter: (to, from, next) => {
      return store.getters['user/loggedIn'] ? router.push({ name: 'Recipes' }) : next()
    }
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    redirect: { name: 'Recipes' },
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
  if (!to.meta.authRequired) {
    return next()
  }

  if (to.meta.authRequired && store.getters['user/loggedIn']) {
    return next()
  } else {
    router.push({ name: 'Recipes' })
  }
})

router.afterEach((to, from, failure) => {
  document.title = to.name
    ? `${to.name?.toString()} - recept0r.com`
    : 'recept0r'
})

export default router