import { GetAccountRepositoryPayload } from '../../data/protocols/get-account-repository'

export interface GetAccount {
  getByEmail: (email: string) => Promise<GetAccountRepositoryPayload>
}
