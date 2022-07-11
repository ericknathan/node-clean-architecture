import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError, EmailInUseError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel, HttpRequest, GetAccount } from './signup-protocols'
import { ok, serverError, badRequest, forbidden } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

const makeGetAccount = (): GetAccount => {
  class GetAccountStub implements GetAccount {
    async getByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new GetAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  getAccountStub: GetAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const getAccountStub = makeGetAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, getAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    getAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 status if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 status if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 status if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 status if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 status if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
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

  test('should return 403 status if provided email is already in use', async () => {
    const { sut, getAccountStub } = makeSut()
    jest.spyOn(getAccountStub, 'getByEmail').mockImplementationOnce(async () => {
      return Promise.resolve(null)
    })

    await sut.handle(makeFakeRequest())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should return 500 status if AddAccount throws', async () => {
    const { sut, addAccountStub, getAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    jest.spyOn(getAccountStub, 'getByEmail').mockImplementationOnce(async () => {
      return Promise.resolve(null)
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub, getAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    jest.spyOn(getAccountStub, 'getByEmail').mockImplementationOnce(async () => {
      return Promise.resolve(null)
    })

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      name: httpRequest.body.name,
      password: httpRequest.body.password
    })
  })

  test('should return 200 status if valid data is provided', async () => {
    const { sut, getAccountStub } = makeSut()
    jest.spyOn(getAccountStub, 'getByEmail').mockImplementationOnce(async () => {
      return Promise.resolve(null)
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
    expect(httpResponse.body).toEqual(makeFakeAccount())
  })
})
