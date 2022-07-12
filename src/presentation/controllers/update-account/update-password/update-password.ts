import { HttpResponse, HttpRequest, Controller } from './update-password-protocols'
import { serverError, unauthorizedError, update } from '../../../helpers/http-helper'
import { UpdateAccount } from '../../../../domain/usecases/update-account'
import { UnauthorizedError } from '../../../errors'

export class UpdatePasswordController implements Controller {
  constructor (
    private readonly updateAccount: UpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const { currentPassword, newPassword } = httpRequest.body

      const accountHasBeenUpdated = await this.updateAccount.updatePassword(id, {
        currentPassword,
        newPassword
      })

      if (!accountHasBeenUpdated) {
        return serverError(new Error('Account has not been updated'))
      }

      return update()
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return unauthorizedError()
      }

      return serverError(error)
    }
  }
}
