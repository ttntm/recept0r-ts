import type { UserData } from 'gotrue-js'
import type { Ref } from 'vue'

export interface GenObj {
  [OKey: string]: any
}

export interface Credentials extends GenObj {
  name?: string
  email: string
  password: string
}

export interface DietMap extends GenObj {
  [DKey: string]: boolean
}

export type DebugInfo = {
  lastUpdate: Date | null
  updateNeeded: boolean
  forceUpdate: boolean
}

export type Headers = {
  Authorization?: string
  'Content-Type': string
}

export interface FilterSelection extends GenObj {
  category: string[]
  diet: string[]
}

export interface IntersectionObserverOptions extends GenObj {
  immediate?: boolean
  root?: Ref
  rootMargin?: string
  threshold?: number | number[]
}

export interface IntersectionObserverReturn {
  isActive: Ref<boolean>
  stop: () => void
}

export interface Recipe extends GenObj {
  id: string
  draft?: boolean
  owner: string
  title: string
  description: string
  image: string
  preparation?: string
  duration: string
  portions: string
  calories?: string
  diet: string | string[]
  category: string
  ingredients: string[]
  body: string
}

export type RecipeDB = {
  ref: {
    '@ref': {
      id: string
      collection: {
        '@ref': {
          id: string
          collection: {
            '@ref': {
              id: string
            }
          }
        }
      }
    }
  }
  ts: number
  data: Recipe
}

export type SortableEl = {
  id: number
  name: string
}

export type SortOption = {
  data: string
  type: string
  text: string
  tooltip: string
}

export type ToastMessage = {
  text: string
  type: 'error' | 'info' | 'success'
}

export type User = UserData

/**
 * Tells TS about custom properties/methods on the Window object
 * See: https://www.cloudhadoop.com/typescript-add-property-window/
 */
declare global {
  interface Window {
    smoothScroll: Function
  }
}
