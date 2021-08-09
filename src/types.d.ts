export interface Credentials {
  [CKey: string]: string
  name?: string
  email: string
  password: string
}

export interface Recipe {
  id: string
  title: string
  category: string
  description: string
  diet: string
  duration: string
  image: string
  ingredients: string[]
  owner: string
  portions: string
  //body: QuillEditorObject
}