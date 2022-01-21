import GoTrue from 'gotrue-js'

export default {
  strict: false,
  namespaced: true,
  state() {
    return {
      currentUser: null,
      GoTrueAuth: null
    }
  },
  getters: {
    loggedIn: state => !!state.currentUser,
    currentUser: state => state.currentUser,
    GoTrueAuth: state => state.GoTrueAuth
  },
  mutations: {
    SET_CURRENT_USER(state, value) {
      state.currentUser = value
    },
    SET_GOTRUE(state, value) {
      state.GoTrueAuth = value
    }
  },
  actions: {
    initializeUser({ commit, dispatch }) {
      // re-initialize GoTrue
      commit('SET_GOTRUE', null)
      dispatch('initAuth')
    },

    attemptConfirmation({ state }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.confirm(token)
          .then(response => {
            resolve(response) // User confirmed
          })
          .catch(error => {
            console.error('An error occurred trying to confirm the user', error)
            reject(error)
          })
      })
    },

    attemptLogin({ commit, dispatch, state }, credentials) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.login(credentials.email, credentials.password, true)
          .then(response => {
            commit('SET_CURRENT_USER', response)
            dispatch('data/readAll', null, { root: true }) // re-build cache; see https://github.com/ttntm/recept0r-ts/issues/17
            dispatch('app/sendToastMessage', { text: `Login successful.`, type: 'success' }, { root: true })
            resolve(response)
          })
          .catch(error => {
            console.error('An error occurred logging in', error)
            dispatch('app/sendToastMessage', { text: `Something's gone wrong logging in, please try again later.`, type: 'error' }, { root: true })
            reject(error)
          })
      })
    },

    attemptLogout({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser()
        user
          .logout()
          .then(response => {
            commit('SET_CURRENT_USER', null)
            dispatch('app/initialize', null, { root: true })
            resolve(response)
          })
          .catch(error => {
            console.error('Could not log user out', error)
            commit('SET_CURRENT_USER', null) // force logout
            dispatch('app/initialize', null, { root: true }) // force app cleanup
            reject(error)
          })
      })
    },

    attemptPasswordRecovery({ state, commit }, token) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.recover(token)
          .then(response => {
            commit('SET_CURRENT_USER', response)
            resolve(response)
          })
          .catch(error => {
            console.error('Failed to verify recover token: %o', error)
            reject(error)
          })
      })
    },

    attemptSignup({ dispatch, getters, state }, credentials) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.signup(credentials.email, credentials.password, { full_name: credentials.name })
          .then(response => {
            dispatch('app/sendToastMessage', { text: `Signup successful, check your emails.`, type: 'success' }, { root: true })
            resolve(response) // Confirmation email sent
          })
          .catch(error => {
            dispatch('app/sendToastMessage', { text: `Something's gone wrong signing up, please try again later.`, type: 'error' }, { root: true })
            reject(error)
          })
      })
    },

    initAuth({ commit, rootGetters }) {
      const APIUrl = rootGetters['app/identityURL']

      const initNewGoTrue = APIUrl => {
        return new GoTrue({
          APIUrl: APIUrl,
          setCookie: true
        })
      }

      commit('SET_GOTRUE', initNewGoTrue(APIUrl))
    },

    processInvite({ state }, data) {
      return new Promise((resolve, reject) => {
        state.GoTrueAuth.acceptInvite(data.token, data.pwd)
          .then(response => {
            resolve(response) // invite successfull, user created
          })
          .catch(error => {
            console.error('An error occurred trying to process the invite', error)
            reject(error)
          })
      })
    },

    refreshUserToken({ commit, dispatch, state }) {
      const user = state.GoTrueAuth.currentUser()
      if (user) {
        return user.jwt()
      } else {
        // if we can't get a new token, then something must have corrupted the GoTrue instance
        // forcing a logout and app initialization to get back to a working state
        commit('SET_CURRENT_USER', null)
        dispatch('app/initialize', null, { root: true })
        dispatch('app/sendToastMessage', { text: `Session error. Please log in again`, type: 'error' }, { root: true })
      }
    },

    requestPasswordRecovery({ dispatch, state }, email) {
      state.GoTrueAuth.requestPasswordRecoveryy(email)
        .then(response => {
          dispatch('app/sendToastMessage', { text: `Recovery email sent.`, type: 'success' }, { root: true })
          resolve(response)
        })
        .catch(error => {
          console.error(`Error sending recovery email`, error)
          dispatch('app/sendToastMessage', { text: `Error sending recovery email, please try again later.`, type: 'error' }, { root: true })
          reject(error)
        })
    },

    updateUserAccount({ dispatch, state }, userData) {
      return new Promise((resolve, reject) => {
        const user = state.GoTrueAuth.currentUser()
        user.update(userData)
          .then(response => {
            dispatch('app/sendToastMessage', { text: `Profile successfully updated.`, type: 'success' }, { root: true })
            resolve(response)
          })
          .catch(error => {
            dispatch('app/sendToastMessage', { text: `Error updating the user profile, please try again later.`, type: 'error' }, { root: true })
            reject(error)
          })
      })
    }
  }
}