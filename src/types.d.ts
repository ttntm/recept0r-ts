import type { UserData } from 'gotrue-js'

export type Credentials = {
  [CKey: string]: string
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

export type FilterSelection = {
  [FKey: string]: string[]
  category: string[]
  diet: string[]
}

export type Recipe = {
  [RKey: string]: any
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
    }
  }
  data: Recipe
}

export type SortOption = {
  data: string
  type: string
  text: string
  tooltip: string
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