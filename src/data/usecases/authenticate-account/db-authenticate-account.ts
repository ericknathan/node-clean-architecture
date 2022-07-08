import { AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  private readonly getAccountRepository: GetAccountRepository

  constructor (getAccountRepository: GetAccountRepository) {
    this.getAccountRepository = getAccountRepository
  }

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    const account = await this.getAccountRepository.getByEmail(credentials.email)

    if (account) {
      console.log(account)
    }

    return null
  }
}
