import { store } from '../store'
import { Credentials } from '@/types'

/**
 * Set authorization headers based on GoTrue's current user session
 */
export async function getAuthHeaders() {
  const now = Date.now();
  const user = store.getters['user/currentUser'];

  let headers: any = {
    'Content-Type': 'application/json'
  };

  // only get a new token if the old one has expired
  const token = user.token && user.token.expires_at < now
    ? await store.dispatch('user/refreshUserToken')
    : user.token.access_token;

  if (token) headers['Authorization'] = `Bearer ${token}`;

  return headers
}

/**
 * Sorts objects based on a specific key using an optional `primer` function
 */
export function objSort(field: any, reverse: number, primer: Function) {
  //generic sorting function for object keys
  const key = primer ?
    function(x: any) {
      return primer(x[field])
    } :
    function(x: any) {
      return x[field]
    }
  
  reverse = !reverse ? 1 : -1;

  return function(a: any, b:any) {
    return a = key(a), b = key(b), reverse * (Number(a > b) - Number(b > a)) // keep this Number() in mind in case there are issues with this sorting function
  }
}

/**
 * Returns an URL slug based on text input
 */
export function slugify(text: string) {
  return text.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase()
}

/**
 * Validates a Credentials object used for signup and login procedures
 */
export function validateCredentials(input: Credentials) {
  // check for empty keys on our credentials object -- otherwise an empty user name might not get caught
  let emptyKeys = Object.keys(input).filter((key: string) => input[key].length < 1)

  if (emptyKeys.length > 0) return false

  if (input.password && input.email && validateEmail(input.email)) {
    return true
  } else {
    return false
  }
}

/**
 * Validates an email address syntactically
 */
export function validateEmail(email: string) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  return rx.test(email);
}