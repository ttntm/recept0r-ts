export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      cdnryUpreset: import.meta.env.VITE_APP_CDNRY_UPRESET,
      cdnryURL: import.meta.env.VITE_APP_CDNRY,
      debugInfo: null,
      identityURL: import.meta.env.VITE_APP_IDENTITY,
      functions: {
        read: import.meta.env.VITE_APP_READ,
        readAll: import.meta.env.VITE_APP_READALL
      },
      toastMessage: null,
      windowOpen: 0
    }
  },

  getters: {
    cdnryUpreset: state => state.cdnryUpreset,
    cdnryURL: state => state.cdnryURL,
    debugInfo: state => state.debugInfo,
    functions: state => state.functions,
    identityURL: state => state.identityURL,
    toastMessage: state => state.toastMessage,
    windowOpen: state => state.windowOpen
  },

  mutations: {
    SET_DEBUG_INFO(state, value){
      state.debugInfo = value
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
      dispatch('data/initializeData', null, { root: true })
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
     * Set debug info based on how the 'Home' view handled the initial 'getAllRecipes()' function
     * @param {object} data 
     */
    setDebugInfo({ commit }, data) {
      commit('SET_DEBUG_INFO', data)
    },

    /**
     * Toggle open modals and windows
     * @param {*} id WindowID: 1 = Mobile Nav || 2 = Login/Signup || 3 = Filter selection || 4 = recipe share menu || 5 = user button menu
     */
    setWindowOpen({ commit }, id) {
      commit('SET_WINDOW_OPEN', id)
    }
  }
}