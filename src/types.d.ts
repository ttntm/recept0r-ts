export interface Credentials {
  [CKey: string]: string
  name?: string
  email: string
  password: string
}