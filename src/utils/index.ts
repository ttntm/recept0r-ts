import { store } from '../store'
import { Credentials } from '@/types'

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

export function objSort (field: any, reverse: number, primer: Function) {
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

export function validateCredentials (input: Credentials) {
  // check for empty keys on our credentials object
  let emptyKeys = Object.keys(input).filter((key: string) => input[key].length < 1)

  if(emptyKeys.length > 0) {
    return false
  } else if (input.password && input.email && validateEmail(input.email)) {
    return true
  } else { 
    return false 
  }
}

export function validateEmail(email: string) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  return rx.test(email);
}