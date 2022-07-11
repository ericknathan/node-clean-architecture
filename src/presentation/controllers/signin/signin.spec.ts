import { InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '../../errors'
import { badRequest, serverError, unauthorizedError, ok } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest, AuthenticateAccount, AuthenticateAccountModel, CredentialsModel } from './signin-protocols'
import { SignInController } from './signin'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthenticateAccount = (): AuthenticateAccount => {
  class AuthenticateAccountStub implements AuthenticateAccount {
    async authenticate (account: CredentialsModel): Promise<AuthenticateAccountModel> {
      return Promise.resolve(makeAuthenticationResponse())
    }
  }

  return new AuthenticateAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthenticationResponse = (): AuthenticateAccountModel => ({
  accessToken: 'any_token'
})

interface SutTypes {
  sut: SignInController
  emailValidatorStub: EmailValidator
  authenticateAccountStub: AuthenticateAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticateAccountStub = makeAuthenticateAccount()
  const sut = new SignInController(emailValidatorStub, authenticateAccountStub)

  return {
    sut,
    emailValidatorStub,
    authenticateAccountStub
  }
}

describe('SignIn Controller', () => {
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

  test('should return 400 status if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 status if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('should return call AuthenticateAccount with correct values', async () => {
    const { sut, authenticateAccountStub } = makeSut()
    const authenticateAccountSpy = jest.spyOn(authenticateAccountStub, 'authenticate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(authenticateAccountSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('should return 500 status if AuthenticateAccount throws', async () => {
    const { sut, authenticateAccountStub } = makeSut()
    jest.spyOn(authenticateAccountStub, 'authenticate').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('should return 401 status if invalid credentials are provided', async () => {
    const { sut, authenticateAccountStub } = makeSut()
    jest.spyOn(authenticateAccountStub, 'authenticate').mockReturnValueOnce(Promise.reject(new UnauthorizedError()))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorizedError())
  })

  test('should return 200 status if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeAuthenticationResponse()))
  })
})
