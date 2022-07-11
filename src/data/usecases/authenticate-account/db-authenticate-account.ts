import { UnauthorizedError } from '../../../presentation/errors'
import { AccessTokenRepository } from '../../protocols/access-token-repository'
import { Encrypter, AuthenticateAccount, AuthenticateAccountModel, GetAccountRepository, CredentialsModel } from './db-authenticate-account-protocols'

export class DbAuthenticateAccount implements AuthenticateAccount {
  constructor (
    private readonly getAccountRepository: GetAccountRepository,
    private readonly passwordComparer: Encrypter,
    private readonly tokenEncrypter: Encrypter,
    private readonly accessTokenRepository: AccessTokenRepository
  ) {}

  async authenticate (credentials: CredentialsModel): Promise<AuthenticateAccountModel> {
    const hashedPassword = await this.passwordComparer.encrypt(credentials.password)
    const account = await this.getAccountRepository.getByCredentials(credentials.email, hashedPassword)
    if (!account) throw new UnauthorizedError()

    const accessToken = await this.tokenEncrypter.encrypt(account.id)
    await this.accessTokenRepository.update(account.id, accessToken)

    return {
      accessToken
    }
  }
}
