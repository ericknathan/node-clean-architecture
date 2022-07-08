import { Comparer, AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  private readonly getAccountRepository: GetAccountRepository
  private readonly comparer: Comparer

  constructor (getAccountRepository: GetAccountRepository, comparer: Comparer) {
    this.getAccountRepository = getAccountRepository
    this.comparer = comparer
  }

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    const account = await this.getAccountRepository.getByEmail(credentials.email)

    if (account) {
      const isValid = await this.comparer.compare(credentials.password, account.password)

      if (isValid) {
        console.log(isValid)
      }
    }

    return null
  }
}
