import { HttpResponse, HttpRequest, Controller } from './signin-protocols'
import { MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignInController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
