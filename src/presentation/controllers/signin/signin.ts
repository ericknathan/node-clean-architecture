import { HttpResponse, HttpRequest, Controller, EmailValidator, AuthenticateAccount } from './signin-protocols'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../errors'
import { badRequest, serverError, unauthorizedError, ok } from '../../helpers/http-helper'

export class SignInController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticateAccount: AuthenticateAccount
  ) {}

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

      const authenticationResponse = await this.authenticateAccount.authenticate({
        email,
        password
      })

      const { accessToken } = authenticationResponse

      return ok({
        accessToken
      })
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return unauthorizedError()
      }

      return serverError(error)
    }
  }
}
