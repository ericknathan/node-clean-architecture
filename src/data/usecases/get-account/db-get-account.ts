import { GetAccount, GetAccountRepository, GetAccountRepositoryPayload } from './db-get-account-protocols'

export class DbGetAccount implements GetAccount {
  constructor (
    private readonly getAccountRepository: GetAccountRepository
  ) {}

  async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
    const account = await this.getAccountRepository.getByEmail(email)
    return account
  }
}
