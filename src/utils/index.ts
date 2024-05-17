import { store } from '@/store'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  Credentials,
  Headers,
  IntersectionObserverOptions,
  IntersectionObserverReturn,
  RecipeDB,
  User
} from '@/types'

const noop: () => void = () => {}

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
  if (!arr) {
    return -1
  }

  return arr.indexOf(item.toLowerCase())
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

/**
 * Get recipe data from Vuex or DB
 * Used for both editable and readonly recipe views
 */
export async function getRecipeData(id: string): Promise<RecipeDB | 'error'> {
  const existing: RecipeDB[] = await store.dispatch('data/getRecipeById', id)
  return existing.length > 0
    ? existing[0]
    : await store.dispatch('data/read', id)
}

/**
 * Checks a path for starting with 'https' and returns 'true' if that's the case
 */
export function isImgUploaded(path: string) {
  const checkImgSrc = RegExp(/^https:\/\//)
  return checkImgSrc.test(path)
}

/**
 * Sorts objects based on a specific key using an optional `primer` function
 */
export function objectSort(field: any, reverse: boolean, primer: Function) {
  const key = primer
    ? (x: any) => primer(x.data[field])
    : (x: any) => x.data[field]

  const reversed = !reverse ? 1 : -1

  return function(a: any, b:any) {
    // keep this Number() in mind in case there are issues with this sorting function
    return a = key(a), b = key(b), reversed * (Number(a > b) - Number(b > a))
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

    return res
      ? {
        message: 'Image successfully uploaded.',
        data: res.secure_url
      }
      : error
  } catch (err) {
    return error
  }
}

export function useBlurredPlaceholder() {
  // Base64 version of ./public/img/blurred.png
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADsklEQVRYR41XC3bbMAyLsvufb2uaf5OdYkkmkgAFyk5f17daVlwDAkBKaX9v19em//Nf9jsGORP3+al8zucw1cb92sg/nt/dp9pPCQgPfVN/54T8hkhL8MLkHQE8/cLKK7rqs7LY91K0IUH+nSuwKn+CT2QW8ArYxz+xQmi3OzKwAWDk4IVbjDMbqogZyDdh4JfBoNlYCWEthfL9K0KYCXFwmyKRZxDyR2ik3ctrGgkY5BhP9BZ22ZOtEDAAB5vAX0sSmSkH77BCotw7bNJakggCLD+svgO+7P/T5mNciOXSppW3bceCCrAjiRVzhuChQAYOQAb4BAknYvP9SmUKAfMZChQCJMLVazb4gm7k/XrJZLn3uXoj8HDwUICEpKAh/6YD+0oX15GJNRMiAyCQ4Fz508BJ4PE9ga0RMPnjWsi4/1ENtRuGCu1+uYQBZfUEf3QnMO5qRHmiQvyvY9UE3oBIkNA8VBuUSLt1AlpyLrmD/ovro5NwK6gCCYT3SYAqbH9BBSpBG5YmuAW38xkCwH+s+GkEOngSsXnPAQjQ/62R6KBOYFyZh6gCzUKtRCcQDCLtsfoAfj6gAtVQAm4qgtfBN77yiYg/E0pEDaASOiBron2dTIHReAp4JxAZABH2hCxDeG2rNwKUH9cBHioIhZShEzjBgkkBBzcbDBxEWI4I4Eh7EHAVMgOmiPUHhnHA69bcrkcjMCkg4E4iKwE9QRUw+U3mBKcNUyW8acedwNE7of+sZmAmUKvAwveOwJoFqQN3xsvhIJ1whDACGOChwuiGYSZbsAVQKkDK0AkgrHMIufs2I8DSYtstPUACGO1YNvX0GBbQimxOYz9I16ST+zrO+32G0K1gvTN44n/phLIBeeejFRxv5kYECjOB0/6Tpw1swdyKRzvWzai0EU35TMJUKPK/I/C5G52QQfSmhM4n3pd9wGMw7YC5Kan0cnLyhjd1wiMIpLy57aIv5FaM9FsGcNgY5wCtd9Q9W3XFizvd0Y+7DzkV64nIxkx+gGcAUUuZcCpByRXcxgmIQXQef2c7dAJ5W86ESHzZgvFoKoDTHgOZZ0Nu/iJ/GK1ftEjgj2TA5vRQOq98aDeO3DyOYcP5RnrsemJDV2C/MwIpQp77Yoq+r6VHARHIPJJnv4O42esyACTT9h+/J4dIZvK8xNdWPUD0SK6Zry+u3y3gSFcABBiKkVL8AVMs6U8Q3edpuz/PJ9TzQUAr0QmMiZFSicyikPQrVz33A9gu+SrKz4m6sP/rkqhzkpZ7YwAAAABJRU5ErkJggg=='
}

/**
 * Port of the vueUse composable; see: https://github.com/vueuse/vueuse/blob/main/packages/core/useIntersectionObserver/index.ts#L4
 * @see https://vueuse.org/useIntersectionObserver
 * @param target The element that should be observed
 * @param callback Callback fn for the IntersectionObserver
 * @param options IntersectionObserver options
 */
export function useIntersectionObserver(
  target: Ref<HTMLElement>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {}
): IntersectionObserverReturn {
  const {
    immediate = true,
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
  } = options

  let cleanup = noop
  const isActive = ref(immediate)

  const stopWatch = watch([isActive, target], () => {
    cleanup()

    if (!isActive.value) return
    if (!target?.value) return

    const observer = new IntersectionObserver(
      callback,
      {
        root: (root?.value as HTMLElement) || undefined,
        rootMargin,
        threshold
      }
    )

    observer.observe(target.value)

    cleanup = () => {
      observer.disconnect()
      cleanup = noop
    }
  }, {
    flush: 'post', immediate
  })

  const stop = () => {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  return {
    isActive,
    stop
  }
}

/**
 * Reusable 'logout' handler
 */
export function useLogout() {
  store.dispatch('user/attemptLogout')
  showWindow(0)
}

/**
 * Search an array of recipes based on a string value
 * Check both `title` and `description` of recipes
 */
export function useRecipeSearch(
  data: RecipeDB[],
  term: string,
  useDraft: boolean = false
): RecipeDB[] {
  const currentTerm: string = term.toLowerCase()
  return data.filter((item: RecipeDB) => {
    if (useDraft && currentTerm === 'draft') {
      // option for keyword "draft" entered in search is active
      // > check draft status; otherwise proceed with regular search
      return item.data?.draft === true
    } else {
      if (item.data.title.toLowerCase().indexOf(currentTerm) === -1) {
        return item.data.description.toLowerCase().indexOf(currentTerm) !== -1
      } else {
        return true
      }
    }
  })
}

/**
 * Validates a Credentials object used for signup and login procedures
 */
export function validateCredentials(input: Credentials) {
  // check for empty keys on our credentials object -- otherwise an empty user name might not get caught
  let emptyKeys: string[] = Object.keys(input).filter((key: string) => input[key].length < 1)

  if (emptyKeys.length > 0) {
    return false
  }

  return Boolean(
    input.password
    && input.email
    && validateEmail(input.email)
  )
}

/**
 * Validates an email address syntactically
 */
export function validateEmail(email: string) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  return rx.test(email)
}
