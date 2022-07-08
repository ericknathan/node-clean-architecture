import { AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  private readonly getAccountRepository: GetAccountRepository

  constructor (getAccountRepository: GetAccountRepository) {
    this.getAccountRepository = getAccountRepository
  }

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    await this.getAccountRepository.getByEmail(credentials.email)
    return null
  }
}
