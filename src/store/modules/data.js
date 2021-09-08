import { apiRequest } from '@/utils'

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
      userRecipes: [],
      userSortOptions: [
        {
          data: 'date',
          type: 'desc',
          text: 'Newest',
          tooltip: 'Sort by date (newest first)'
        },
        {
          data: 'date',
          type: 'asc',
          text: 'Oldest',
          tooltip: 'Sort by date (oldest first)'
        },
        {
          data: 'abc',
          type: 'asc',
          text: 'ABC...',
          tooltip: 'Sort alphabetically'
        },
        {
          data: 'abc',
          type: 'desc',
          text: 'ZYX...',
          tooltip: 'Sort alphabetically (reverse)'
        }
      ]
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
    userRecipes: state => state.userRecipes,
    userRecipesLength: state => state.userRecipes.length,
    userSortOptions: state => state.userSortOptions
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
    initializeData({ commit }) {
      commit('SET_FILTER_CACHE', [])
      commit('SET_FILTER_DATA', {})
      commit('SET_FILTER_STATE', false)
      commit('SET_USER_RECIPES', [])
    },
    /**
    * @param args - an array provided by 'RecipeFilter.vue' that provides input for 'mode' in [0] and 'selection' in [1]
    */
    applyFilter({ commit, getters}, args) {
      const allRecipes = getters.allRecipes
      const fData = getters.filterData
      const fState = getters.filterActive
      const recipeCache = getters.filterCache
      const [mode, selection] = args
      
      let currentFilterData = Object.assign(fData, { [mode]: selection }) // format the data for filtering
      commit('SET_FILTER_DATA', currentFilterData) // commit the filter settings
      
      const findIndex = (arr, el) => {
        if (!arr) return -1
        return arr.length === 0 ? 0 : arr.indexOf(el)
      }
      
      const doFilter = (input) => {
        let fDataLength = Object.keys(fData).length

        return input.filter((item) => {
          // prepare the data
          let cat = findIndex(fData.category, item.data.category.toLowerCase())
          let dt = findIndex(fData.diet, item.data.diet.toLowerCase())
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
      }

      let filtered = []

      if(!fState) {
        // if there is NO active filter
        commit('SET_FILTER_STATE', true)
        // create cache
        commit('SET_FILTER_CACHE', allRecipes.slice())
        // apply to the current state of 'allRecies'
        filtered = doFilter(allRecipes)
      } else {
        // overwrite previously filtered list based on current filter selection
        filtered = doFilter(recipeCache)
      }
      commit('SET_ALL_RECIPES', filtered)
    },

    clearFilter({ commit, getters }) {
      // get state from before applying a filter
      const recipeCache = getters.filterCache
      // restore that state
      commit('SET_ALL_RECIPES', recipeCache)
      // set filter state and clear filter data
      commit('SET_FILTER_STATE', false)
      commit('SET_FILTER_DATA', {})
    },

    async create({ commit, dispatch, getters }, recipe) {
      const apiResponse = await apiRequest('POST', recipe)
      const created = apiResponse.ref ? apiResponse.ref['@ref'].id : null

      if (created) {
        // it's always a new recipe, let's add it to the respective local state
        // keep in mind that `allRecipes` doesn't include drafts
        // NB: this _doesn't_ consider concurrency at all, due to the (intentionally) small amount of users
        const target = () => {
          if (getters.userRecipesLength <= 0 && !apiResponse.data.draft) return 'all'
          if (getters.userRecipesLength > 0) {
            return apiResponse.data.draft ? 'user' : 'both'
          } else {
            return undefined
          }
        }
        if (target()) commit(`ADD_RECIPE_${target().toUpperCase()}`, apiResponse)
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
      const result = []
      
      const getRecipe = (source, lookup) => source.find(item => item.ref['@ref'].id === lookup)
      
      if (allRecipes.length > 0) {
        const inAll = getRecipe(allRecipes, id)
        if (inAll) { 
          result.push(inAll)
        } else {
          const inUser = userRecipes.length > 0 ? getRecipe(userRecipes, id) : null
          if (inUser) result.push(inUser)
        }
      }
      
      return result
    },

    updateLocalRecipes({ commit, getters }, args) {
      const [mode, recipeUpdate] = args
      const allRecipes = getters.allRecipes
      const userRecipes = getters.userRecipes
      const id = recipeUpdate.ref['@ref'].id

      const mustUpdateUR = () => userRecipes.length > 0

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
          updatedUsrArr = mustUpdateUR() ? upsertRecord(userRecipes, id, recipeUpdate) : updatedUsrArr
          break
        
        case 'remove':
          updatedArr = removeRecord(allRecipes, id)
          updatedUsrArr = mustUpdateUR() ? removeRecord(userRecipes, id) : updatedUsrArr
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