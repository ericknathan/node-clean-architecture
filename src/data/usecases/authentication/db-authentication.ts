import { Authentication, AuthenticationCredentials } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGeneratorStub: TokenGenerator
  ) {}

  async auth (credentials: AuthenticationCredentials): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (account) {
      const isValid = await this.hashComparer.compare(credentials.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGeneratorStub.generate(account.id)
        return accessToken
      }
    }

    return null
  }
}
