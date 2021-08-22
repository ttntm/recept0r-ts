import { apiRequest } from '../../utils'

export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      allRecipes: [],
      filterActive: false,
      filterCache: [], //used to store a copy of the current 'allRecipes' state before applying a filter to be restored into 'allRecipes' when clearing filter selection
      filterData: {},
      lastUpdated: '',
      recipeCategory: [
        'Bread',
        'Salad',
        'Dessert',
        'Drink',
        'Main',
        'Snack',
        'Soup',
        'Pastry'
      ],
      recipeDiet: [
        'Keto',
        'Vegetarian',
        'Vegan',
        'Other'
      ],
      userRecipes: []
    }
  },

  getters: {
    allRecipes: state => state.allRecipes,
    filterActive: state => state.filterActive,
    filterCache: state => state.filterCache,
    filterData: state => state.filterData,
    lastUpdated: state => state.lastUpdated,
    recipeCategory: state => state.recipeCategory,
    recipeDiet: state => state.recipeDiet,
    userRecipes: state => state.userRecipes
  },

  mutations: {
    ADD_RECIPE_ALL(state, value) {
      state.allRecipes.push(value)
    },
    ADD_RECIPE_BOTH(state, value) {
      state.allRecipes.push(value)
      state.userRecipes.push(value)
    },
    ADD_RECIPE_USER(state, value) {
      state.userRecipes.push(value)
    },
    SET_ALL_RECIPES(state, value) {
      state.allRecipes = value
    },
    SET_FILTER_CACHE(state, value) {
      state.filterCache = value
    },
    SET_FILTER_DATA(state, value) {
      state.filterData = value
    },
    SET_FILTER_STATE(state, value) {
      state.filterActive = value
    },
    SET_LAST_UPDATED(state, value) {
      state.lastUpdated = value
    },
    SET_USER_RECIPES(state, value) {
      state.userRecipes = value
    }
  },

  actions: {
    /**
    * @param args - an array provided by 'RecipeFilter.vue' that provides input for 'mode' in [0] and 'selection' in [1]
    */
    applyFilter({ commit, getters}, args) {
      const fState = getters.filterActive
      const fData = getters.filterData
      const recipes = getters.allRecipes
      const fromCache = getters.filterCache

      let filtered = new Array
      let mode = args[0].toLowerCase() // strig value
      let selection = args[1].map(item => item.toLowerCase()) // array based on 'RecipeFilter.vue' component state lowercased just to make sure

      // format the data for filtering
      let currentFilterData = Object.assign(fData, { [mode]: selection })
      // commit the filter settings
      commit('SET_FILTER_DATA', currentFilterData)

      const findIndex = (arr, el) => {
        if (arr !== undefined) {
          if (arr.length === 0) {
            return 0
          } else {
            return arr.indexOf(el)
          }
        } else { return -1 }
      }

      const doFilter = (input) => {
        let result = new Array
        let fDataLength = Object.keys(fData).length

        result = input.filter((item) => {
          // prepare the data
          let cat = findIndex(fData.category, item.category.toLowerCase())
          let dt = findIndex(fData.diet, item.diet.toLowerCase())
          // handle the possibilities
          switch(fDataLength) {
            case 2:
              // fDataLength = 2 -- BOTH conditions are set
              if(cat !== -1 && dt !== -1) {
                return true
              }
              break

            case 1:
              // fDataLength = 1 -- ONE condition is set
              if(cat !== -1 || dt !== -1) {
                return true
              }
              break

            default:
              return false
          }
        })
        // return the filtered array
        return result
      }

      if(!fState) {
        // if there is NO active filter
        commit('SET_FILTER_STATE', true)
        // apply to the current state of 'allRecies'
        filtered = doFilter(recipes)
      } else {
        // apply to previously filtered selection
        filtered = doFilter(fromCache)
      }

      commit('SET_ALL_RECIPES', filtered)
    },

    clearFilter({ commit, getters }) {
      // get state from before applying a filter
      const fromCache = getters.filterCache
      // restore that state
      commit('SET_ALL_RECIPES', fromCache)
      // set filter state and clear filter data
      commit('SET_FILTER_STATE', false)
      commit('SET_FILTER_DATA', {})
    },

    async create({ commit, dispatch }, recipe) {
      const apiResponse = await apiRequest('POST', recipe)
      const created = apiResponse.ref ? apiResponse.ref['@ref'].id : null

      if (created) {
        // it's always a new recipe, let's add it to the respective local state
        // keep in mind that `allRecipes` doesn't include drafts
        // NB: this _doesn't_ consider concurrency at all, due to the (intentionally) small amount of users
        const target = apiResponse.data.draft ? 'user' : 'both'
        commit(`ADD_RECIPE_${target.toUpperCase()}`, apiResponse)
        dispatch('app/sendToastMessage', { text: `"${apiResponse.data.title}" successfully created.`, type: 'success' }, { root: true })
        return created
      } else {
        dispatch('app/sendToastMessage', { text: `An error occurred. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    async read({ commit, dispatch, rootGetters }, id) {
      const fn = rootGetters['app/functions']
      const request = await fetch(`${fn.read}/${id}`, { method: 'GET' })
      const response = await request.json()
      const current = response.ref ? response.ref['@ref'].id : null

      if (current) {
        // -- questionable use case --
        // add the record to `allRecipes` before returning the data to the view
        commit(`ADD_RECIPE_ALL`, response)
        return response
      } else {
        dispatch('app/sendToastMessage', { text: `Couldn't get recipe data. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    async readAll({ commit, dispatch, rootGetters }) {
      const fn = rootGetters['app/functions']
      const request = await fetch(fn.readAll, { method: 'GET' })
      const response = await request.json()

      if (response.length > 0) {
        commit('SET_ALL_RECIPES', response)
        commit('SET_LAST_UPDATED', new Date)
      } else {
        dispatch('app/sendToastMessage', { text: `Error loading recipes. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    async readUser({ commit, dispatch }, userId) {
      const apiResponse = await apiRequest('GET', null, `owner/${userId}`)

      if (apiResponse.length > 0) {
        commit('SET_USER_RECIPES', apiResponse)
      } else {
        dispatch('app/sendToastMessage', { text: `Error loading recipes. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    async update({ dispatch }, args) {
      const [id, update] = args
      const apiResponse = await apiRequest('PUT', update, id)
      const updated = apiResponse.ref ? apiResponse.ref['@ref'].id : null

      if (updated) {
        // we edited a recipe that was already fetched from the DB at some point; either via `allRecipes` or as a single read
        // we know for sure that it's in `allRecipes` by now, so we should update the local state without further DB reads
        dispatch('updateLocalRecipes', ['update', apiResponse])
        dispatch('app/sendToastMessage', { text: `"${apiResponse.data.title}" successfully updated.`, type: 'success' }, { root: true })
        return 'success'
      } else {
        dispatch('app/sendToastMessage', { text: `Couldn't update the recipe. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    async delete({ dispatch }, id) {
      const apiResponse = await apiRequest('DELETE', null, id)
      const deleted = apiResponse.ref ? apiResponse.ref['@ref'].id : null

      if (deleted) {
        dispatch('updateLocalRecipes', ['remove', apiResponse])
        dispatch('app/sendToastMessage', { text: `Deleted recipe "${apiResponse.data.title}".`, type: 'success' }, { root: true })
        return 'success'
      } else {
        dispatch('app/sendToastMessage', { text: `Error deleting the recipe. Please try again later.`, type: 'error' }, { root: true })
        return 'error'
      }
    },

    getRecipeById({ getters }, id) {
      const allRecipes = getters.allRecipes
      const userRecipes = getters.userRecipes
      
      const getRecipe = (source, lookup) => source.filter(item => item.ref['@ref'].id === lookup)
      
      const inAll = allRecipes.length > 0 ? getRecipe(allRecipes, id) : null
      const inUser = userRecipes.length > 0 ? getRecipe(userRecipes, id) : null

      return inAll && inAll.length > 0
        ? inAll
        : inUser && inUser.length > 0
          ? inUser
          : []
    },

    updateLocalRecipes({ commit, getters }, args) {
      const [mode, recipeUpdate] = args
      const allRecipes = getters.allRecipes
      const userRecipes = getters.userRecipes
      const id = recipeUpdate.ref['@ref'].id

      const removeRecord = (input, removalId) => input.filter(item => item.ref['@ref'].id !== removalId)

      const upsertRecord = (input, recordId, recordData) => {
        let replaced = false
        let processed = input.map(item => {
          if (item.ref['@ref'].id !== recordId) {
            return item
          } else {
            replaced = true
            return recordData
          }
        })
        if (!replaced) processed.push(recordData)
        return processed
      }

      let updatedArr = []
      let updatedUsrArr = []

      switch (mode) {
        case 'update':
          // keep in mind that we have to remove drafts from `allRecipes`
          updatedArr = recipeUpdate.data.draft ? removeRecord(allRecipes, id) : upsertRecord(allRecipes, id, recipeUpdate)
          updatedUsrArr = upsertRecord(userRecipes, id, recipeUpdate)
          break
        
        case 'remove':
          updatedArr = removeRecord(allRecipes, id)
          updatedUsrArr = removeRecord(userRecipes, id)
          break

        default:
          break
      }

      commit('SET_LAST_UPDATED', new Date)
      commit('SET_ALL_RECIPES', updatedArr)
      commit('SET_USER_RECIPES', updatedUsrArr)
    }
  }
}