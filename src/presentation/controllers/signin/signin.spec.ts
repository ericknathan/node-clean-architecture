import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { SignInController } from './signin'

describe('SignIn Controller', () => {
  test('should return 400 status if no email is provided', async () => {
    const sut = new SignInController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test.todo('should return 400 status if no password is provided')
  test.todo('should return 400 status if an invalid email is provided')
  test.todo('should return 401 status if invalid credentials are provided')
  test.todo('should return 200 status if valid credentials is provided')
  test.todo('should call EmailValidator with correct email')
  test.todo('should return 500 status if EmailValidator throws')
  test.todo('should return call Authentication with correct values')
  test.todo('should return 500 status if Authentication throws')
})
