import { HttpResponse, HttpRequest, Controller, EmailValidator } from './update-data-protocols'
import { InvalidParamError } from '../../../errors'
import { badRequest, serverError, update } from '../../../helpers/http-helper'
import { UpdateAccount } from '../../../../domain/usecases/update-account'

export class UpdateDataController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly updateAccount: UpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const { email } = httpRequest.body

      const blockedFields = ['id', 'password', 'accessToken']

      for (const field of blockedFields) {
        if (httpRequest.body[field]) {
          return badRequest(new InvalidParamError(field))
        }
      }

      if (email) {
        const isValid = this.emailValidator.isValid(email)
        if (!isValid) {
          return badRequest(new InvalidParamError('email'))
        }
      }

      const accountHasBeenUpdated = await this.updateAccount.updateData(id, {
        ...httpRequest.body
      })

      if (!accountHasBeenUpdated) {
        return badRequest(new Error('Account has not been updated'))
      }

      return update()
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
