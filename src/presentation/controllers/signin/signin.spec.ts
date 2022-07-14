import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { SignInController } from './signin'

interface SutTypes {
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const sut = new SignInController()
  return {
    sut
  }
}

describe('Login Controller', () => {
  test('should return 400 status if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 status if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
