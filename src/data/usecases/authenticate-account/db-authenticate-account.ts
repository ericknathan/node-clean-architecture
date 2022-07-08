import { Comparer, Encrypter, AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  private readonly getAccountRepository: GetAccountRepository
  private readonly comparer: Comparer
  private readonly encrypter: Encrypter

  constructor (getAccountRepository: GetAccountRepository, comparer: Comparer, encrypter: Encrypter) {
    this.getAccountRepository = getAccountRepository
    this.comparer = comparer
    this.encrypter = encrypter
  }

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    const account = await this.getAccountRepository.getByEmail(credentials.email)

    if (account) {
      const isValid = await this.comparer.compare(credentials.password, account.password)

      if (isValid) {
        await this.encrypter.encrypt(account.id)
      }
    }

    return null
  }
}
