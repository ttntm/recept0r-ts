import { store } from '../store'
import type { Credentials, Headers } from '../types'

export async function apiRequest(reqMethod: string, payload?: any, reqPath: string = '') {
  const url = String(import.meta.env.VITE_APP_API)
  const path = reqPath ? `${url}/${reqPath}` : url
  
  const body = payload ? JSON.stringify(payload) : undefined
  const headers = await getAuthHeaders()
  const method = reqMethod
  const reqData = { body, headers, method }

  let response

  try {
    const request = await fetch(path, reqData)
    response = request ? await request.json() : null
  } catch (err) {
    response = err
  }

  return response
}

/**
 * Returns the index of an element in the given array
 */
export function getArrayIndex(arr: string[], item: string) {
  const target = [...arr]
  return target.indexOf(item.toLowerCase())
}

/**
 * Set authorization headers based on GoTrue's current user session
 */
export async function getAuthHeaders() {
  const now = Date.now()
  const user = store.getters['user/currentUser']

  let headers: Headers = {
    'Content-Type': 'application/json'
  }

  // only get a new token if the old one has expired
  const token = user.token && user.token.expires_at < now
    ? await store.dispatch('user/refreshUserToken')
    : user.token.access_token

  if (token) headers['Authorization'] = `Bearer ${token}`

  return headers
}

/**
 * Get recipe data from Vuex or DB
 * Used for both editable and readonly recipe views
 */
export async function getRecipeData(id: string) {
  const existing = await store.dispatch('data/getRecipeById', id)

  return existing.length > 0
    ? existing[0]
    : await store.dispatch('data/read', id)
}

/**
 * Sorts objects based on a specific key using an optional `primer` function
 */
export function objectSort(field: any, reverse: boolean, primer: Function) {
  const key = primer ? (x: any) => primer(x.data[field]) : (x: any) => x.data[field]
  
  const reversed = !reverse ? 1 : -1

  return function(a: any, b:any) {
    return a = key(a), b = key(b), reversed * (Number(a > b) - Number(b > a)) // keep this Number() in mind in case there are issues with this sorting function
  }
}

/**
 * Helper function to show/hide modals and windows
 */
export function showWindow(id: number) {
  store.dispatch('app/setWindowOpen', id)
}

/**
 * Returns an URL slug based on text input
 */
export function slugify(text: string) {
  return text.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase()
}

/**
 * Uploads an image to Cloudinary
 * @param data String representation of the image coming from file reader
 */
export async function uploadImage(url: string, data: FormData) {
  const error = {
    message: 'Error uploading image.',
    data: null
  }

  try {
    const req = await fetch(url, {
      body: data,
      method: 'POST'
    })

    const res = await req.json()

    return res? { message: 'Image successfully uploaded.', data: res.secure_url } : error
  } catch (err) {
    return error
  }
}

/**
 * Search an array of recipes based on a string value
 */
export function useRecipeSearch(data: any[], term: string) {
  return data.filter((item: any) => {
    if (item.data.title.toLowerCase().indexOf(term.toLowerCase()) === -1) { //if there was no match for the title...
      return item.data.description.toLowerCase().indexOf(term.toLowerCase()) !== -1 ? true : false //...evaluate the description
    } else { 
      return true 
    }
  })
}

/**
 * Validates a Credentials object used for signup and login procedures
 */
export function validateCredentials(input: Credentials) {
  // check for empty keys on our credentials object -- otherwise an empty user name might not get caught
  let emptyKeys = Object.keys(input).filter((key: string) => input[key].length < 1)

  if (emptyKeys.length > 0) return false

  return Boolean(input.password && input.email && validateEmail(input.email))
}

/**
 * Validates an email address syntactically
 */
export function validateEmail(email: string) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  return rx.test(email)
}