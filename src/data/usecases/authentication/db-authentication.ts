import { Authentication, AuthenticationCredentials } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (credentials: AuthenticationCredentials): Promise<string> {
    await this.loadAccountByEmailRepository.load(credentials.email)
    return null
  }
}
