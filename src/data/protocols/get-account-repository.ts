export interface GetAccountRepositoryPayload {
  id: string
  name: string
  password: string
}

export interface GetAccountRepository {
  getById: (id: string) => Promise<GetAccountRepositoryPayload>
  getByEmail: (email: string) => Promise<GetAccountRepositoryPayload>
  getByCredentials: (email: string, password: string) => Promise<GetAccountRepositoryPayload>
}
