export type Credentials = {
  [CKey: string]: string
  name?: string
  email: string
  password: string
}

export type FilterSelection = {
  [FKey: string]: string[],
  category: string[],
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