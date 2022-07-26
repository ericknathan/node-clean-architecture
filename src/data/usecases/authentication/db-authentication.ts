import { Authentication, AuthenticationCredentials } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (credentials: AuthenticationCredentials): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)
    if (account) {
      await this.hashComparer.compare(credentials.password, account.password)
    }

    return null
  }
}
