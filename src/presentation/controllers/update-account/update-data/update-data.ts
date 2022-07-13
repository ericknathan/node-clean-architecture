import { HttpResponse, HttpRequest, Controller, EmailValidator } from './update-data-protocols'
import { InvalidParamError } from '../../../errors'
import { badRequest, serverError, ok } from '../../../helpers/http-helper'
import { UpdateAccount } from '../../../../domain/usecases/update-account'

export class UpdateDataController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly updateAccount: UpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.user
      const { name, email } = httpRequest.body

      if (email) {
        const isValid = this.emailValidator.isValid(email)
        if (!isValid) {
          return badRequest(new InvalidParamError('email'))
        }
      }

      await this.updateAccount.updateData(id, {
        name,
        email
      })

      return ok({ message: 'Data updated successfully' })
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error)
      }

      return serverError(error)
    }
  }
}
