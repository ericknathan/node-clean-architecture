import { GetAccount, GetAccountRepository, GetAccountRepositoryPayload } from './db-get-account-protocols'

export class DbGetAccount implements GetAccount {
  constructor (
    private readonly getAccountRepository: GetAccountRepository
  ) {}

  async getById (userId: string): Promise<GetAccountRepositoryPayload> {
    const account = await this.getAccountRepository.getById(userId)
    return account
  }

  async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
    const account = await this.getAccountRepository.getByEmail(email)
    return account
  }

  async getByCredentials (email: string, password: string): Promise<GetAccountRepositoryPayload> {
    const account = await this.getAccountRepository.getByCredentials(email, password)
    return account
  }
}
