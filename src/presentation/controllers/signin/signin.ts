import { HttpResponse, HttpRequest, Controller, EmailValidator, AuthenticateAccount } from './signin-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignInController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticateAccount: AuthenticateAccount

  constructor (emailValidator: EmailValidator, authenticateAccount: AuthenticateAccount) {
    this.emailValidator = emailValidator
    this.authenticateAccount = authenticateAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authenticateAccount.authenticate({
        email,
        password
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
