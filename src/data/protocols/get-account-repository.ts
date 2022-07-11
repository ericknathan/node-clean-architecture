export interface GetAccountRepositoryPayload {
  id: string
  name: string
  password: string
}

export interface GetAccountRepository {
  getByEmail: (email: string) => Promise<GetAccountRepositoryPayload>
  getByCredentials: (email: string, password: string) => Promise<GetAccountRepositoryPayload>
}
