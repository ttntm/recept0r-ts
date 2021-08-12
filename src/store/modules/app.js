export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      cdnryUpreset: import.meta.env.VITE_APP_CDNRY_UPRESET,
      cdnryURL: import.meta.env.VITE_APP_CDNRY,
      functions: {
        api: import.meta.env.VITE_APP_API
      },
      menuOpen: false,
      toastMessage: null,
      windowOpen: 0
    }
  },

  getters: {
    cdnryUpreset: state => state.cdnryUpreset,
    cdnryURL: state => state.cdnryURL,
    functions: state => state.functions,
    menuOpen: state => state.menuOpen,
    toastMessage: state => state.toastMessage,
    windowOpen: state => state.windowOpen
  },

  mutations: {
    SET_MENU_OPEN(state, value) {
      state.menuOpen = value
    },
    SET_TOAST_MESSAGE(state, value) {
      state.toastMessage = value
    },
    SET_WINDOW_OPEN(state, value) {
      state.windowOpen = value
    }
  },

  actions: {
    initialize({ dispatch }) {
      // global state reset action triggering module actions to keep things separate
      dispatch('user/initializeUser', null, { root: true });
    },

    /**
    * @param {object} message - a message object as required by ToastMeassage.vue with 2 keys, "text" and "type"
    */
    sendToastMessage({ commit }, message) {
      let timer

      clearTimeout(timer)

      commit('SET_TOAST_MESSAGE', message)

      timer = setTimeout(() => {
        commit('SET_TOAST_MESSAGE', null)
      }, 5000)
    },

    toggleMenu({ commit }, newState) {
      commit('SET_MENU_OPEN', newState)
    },

    windowActive({ commit }, id) {
      commit('SET_WINDOW_OPEN', id)
    }
  }
}