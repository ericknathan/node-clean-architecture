import { AccessTokenRepository } from '../../protocols/access-token-repository'
import { Comparer, Encrypter, AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  private readonly getAccountRepository: GetAccountRepository
  private readonly comparer: Comparer
  private readonly encrypter: Encrypter
  private readonly accessTokenRepository: AccessTokenRepository

  constructor (getAccountRepository: GetAccountRepository, comparer: Comparer, encrypter: Encrypter, accessTokenRepository: AccessTokenRepository) {
    this.getAccountRepository = getAccountRepository
    this.comparer = comparer
    this.encrypter = encrypter
    this.accessTokenRepository = accessTokenRepository
  }

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    const account = await this.getAccountRepository.getByEmail(credentials.email)

    if (account) {
      const isValid = await this.comparer.compare(credentials.password, account.password)

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.accessTokenRepository.update(account.id, accessToken)

        return {
          accessToken
        }
      }
    }

    return null
  }
}
