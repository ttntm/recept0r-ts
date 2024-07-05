import { createApp } from 'vue'
import router from './router'
import { store, key } from './store'
import detectTokens from './utils/useToken'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Unlazy from '@unlazy/vue'

import App from './App.vue'

import './index.css'

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(Unlazy)

store.dispatch('user/initAuth')

detectTokens()

const clickBlurExclude: string[] = ['INPUT','SELECT','TEXTAREA']
let escHandler: any = null
let handleClickBlur: Function | null = null
let handleOutsideClick: any = null

app.directive('click-blur', {
  beforeMount(el, binding, vnode) {
    handleClickBlur = (e: { currentTarget: HTMLElement }) => {
      if (clickBlurExclude.indexOf(e.currentTarget.nodeName) === -1) {
        e.currentTarget.blur()
      }
    }
    el.addEventListener('click', handleClickBlur, false)
    el.addEventListener('touchend', handleClickBlur, false)
  },
  beforeUnmount(el) {
    el.removeEventListener('click', handleClickBlur)
    el.removeEventListener('touchend', handleClickBlur)
  }
})

app.directive('click-outside', {
  beforeMount(el, binding, vnode) {
    handleOutsideClick = (e: Event & { target: HTMLElement }) => {
      if (!el.contains(e.target) && !e.target.classList.contains('click-outside-ignore')) {
        binding.value()
      }
    }
    document.addEventListener('click', handleOutsideClick, false)
    document.addEventListener('touchstart', handleOutsideClick, false)
  },
  beforeUnmount() {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchstart', handleOutsideClick)
  }
})

app.directive('esc', {
  beforeMount(el, binding, vnode) {
    escHandler = (e: KeyboardEvent) => {
      if (e.key=='Escape' || e.key=='Esc') {
        binding.value()
      }
    }
    document.addEventListener('keydown', escHandler)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', escHandler)
  }
})

app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.directive('scroll-lock', {
  // there could be issues with iOS at some point: https://github.com/willmcpo/body-scroll-lock#allowtouchmove
  beforeMount(el, binding, vnode) {
    disableBodyScroll(el) // desirable, but causes body twitch: { reserveScrollBarGap: true }
  },
  beforeUnmount(el) {
    enableBodyScroll(el)
  }
})

app.mount('#app')
