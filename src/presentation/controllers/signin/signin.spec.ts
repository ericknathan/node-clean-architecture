import { SignInController } from './signin'
import { MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helper'
import { HttpRequest, Authentication, Validation } from './signin-protocols'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: SignInController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new SignInController(authenticationStub, validationStub)

  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)

    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith(email, password)
  })

  test('should return 401 status if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 status if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValue(Promise.reject(new Error()))

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 status if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 status if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
