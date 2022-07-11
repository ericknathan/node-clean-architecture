import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount, GetAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError, EmailInUseError } from '../../errors'
import { badRequest, serverError, ok, forbidden } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly getAccount: GetAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidParamError('email'))

      const emailAlreadyInUse = await this.getAccount.getByEmail(email)
      if (emailAlreadyInUse !== null) return forbidden(new EmailInUseError())

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
