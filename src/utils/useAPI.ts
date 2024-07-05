import { store } from '@/store'
import type {
  Headers,
  User
} from '@/types'

/**
 * Shared logic to handle API requests to the app's serverless back end functions
 */
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
    response = request
      ? await request.json()
      : null
  } catch (err) {
    response = err
  }

  return response
}

/**
 * Set authorization headers based on GoTrue's current user session
 */
export async function getAuthHeaders() {
  const now = Date.now()
  const user: User = store.getters['user/currentUser']

  let headers: Headers = {
    'Content-Type': 'application/json'
  }

  // only get a new token if the old one has expired
  const token = user.token && user.token.expires_at < now
    ? await store.dispatch('user/refreshUserToken')
    : user.token.access_token

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}
