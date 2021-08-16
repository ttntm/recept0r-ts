export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      cdnryUpreset: import.meta.env.VITE_APP_CDNRY_UPRESET,
      cdnryURL: import.meta.env.VITE_APP_CDNRY,
      identityURL: import.meta.env.VITE_APP_IDENTITY,
      functions: {
        api: import.meta.env.VITE_APP_API
      },
      toastMessage: null,
      windowOpen: 0
    }
  },

  getters: {
    cdnryUpreset: state => state.cdnryUpreset,
    cdnryURL: state => state.cdnryURL,
    functions: state => state.functions,
    identityURL: state => state.identityURL,
    toastMessage: state => state.toastMessage,
    windowOpen: state => state.windowOpen
  },

  mutations: {
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
      dispatch('user/initializeUser', null, { root: true })
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

    /**
     * Toggle open modals and windows
     * @param {*} id WindowID: 1 = Mobile Nav || 2 = Login/Signup
     */
    setWindowOpen({ commit }, id) {
      commit('SET_WINDOW_OPEN', id)
    }
  }
}