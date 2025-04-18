import { store } from '@/store'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  Credentials,
  IntersectionObserverOptions,
  IntersectionObserverReturn,
  Recipe,
} from '@/types'

const noop: () => void = () => {}

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
 * Checks an array with a list of items
 * Returns `-1` when there are no matches, and a number >0 if there were matches (min. 1)
 */
export function getArrayIndexList(arr: string[], list: string[]): number {
  if (!arr || !list) {
    return -1
  }

  const included: number[] = []

  list.forEach((el, index) => {
    if (arr.includes(el.toLowerCase())) {
      included.push(index)
    }
  })

  return included.length || -1
}

/**
 * Get recipe data from Vuex or DB
 * Used for both editable and readonly recipe views
 */
export async function getRecipeData(id: string): Promise<Recipe | 'error'> {
  const existing: Recipe[] = await store.dispatch('data/getRecipeById', id)

  return existing.length > 0
    ? existing[0]
    : await store.dispatch('data/read', id)
}

/**
 * Sorts objects based on a specific key using an optional `primer` function
 */
export function objectSort(field: any, reverse: boolean, primer: Function) {
  const key = primer
    ? (x: any) => primer(x[field])
    : (x: any) => x[field]

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

    if (!isActive.value || !target?.value) {
      return
    }

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
  data: Recipe[],
  term: string,
  useDraft: boolean = false
): Recipe[] {
  const currentTerm: string = term.toLowerCase()
  return data.filter((item: Recipe) => {
    if (useDraft && currentTerm === 'draft') {
      // option for keyword "draft" entered in search is active
      // > check draft status; otherwise proceed with regular search
      return item.status === 'draft'
    } else {
      if (item.title.toLowerCase().indexOf(currentTerm) === -1) {
        return item.description.toLowerCase().indexOf(currentTerm) !== -1
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
