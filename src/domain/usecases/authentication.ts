export interface AuthenticationCredentials {
  email: string
  password: string
}

export interface Authentication {
  auth: (credentials: AuthenticationCredentials) => Promise<string>
}
