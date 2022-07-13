import { HttpResponse, HttpRequest, Controller, EmailValidator } from './update-data-protocols'
import { ClientError, InvalidParamError } from '../../../errors'
import { badRequest, serverError, update } from '../../../helpers/http-helper'
import { UpdateAccount } from '../../../../domain/usecases/update-account'

export class UpdateDataController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly updateAccount: UpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.user
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

      await this.updateAccount.updateData(id, {
        ...httpRequest.body
      })

      return update()
    } catch (error) {
      if (error instanceof InvalidParamError || error instanceof ClientError) {
        return badRequest(error)
      }

      return serverError(error)
    }
  }
}
