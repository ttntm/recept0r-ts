import type { UserData } from 'gotrue-js'

export interface GenObj {
  [OKey: string]: any
}

export interface Credentials extends GenObj {
  name?: string
  email: string
  password: string
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

export interface Recipe extends GenObj {
  id: string
  draft?: boolean
  title: string
  category: string
  description: string
  diet: string
  duration: string
  image: string
  ingredients: string[]
  owner: string
  portions: string
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
  type: 'error' | 'success' |'info'
}

export type User = UserData

/**
 * We need to tell TS about custom properties/methods on the Window object
 * See: https://www.cloudhadoop.com/typescript-add-property-window/
 */
declare global {
  interface Window {
    smoothScroll: Function
  }
}