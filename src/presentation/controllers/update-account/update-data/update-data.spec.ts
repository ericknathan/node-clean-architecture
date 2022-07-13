import { UpdateDataController } from './update-data'
import { InvalidParamError } from '../../../errors'
import { badRequest, serverError } from '../../../helpers/http-helper'
import { EmailValidator, HttpRequest, UpdateAccount, UpdateAccountDataModel } from './update-data-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeUpdateAccount = (): UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    async updateData (userId: string, newData: UpdateAccountDataModel): Promise<boolean> {
      return Promise.resolve(true)
    }

    updatePassword: () => Promise<boolean>
  }

  return new UpdateAccountStub()
}

interface SutTypes {
  sut: UpdateDataController
  emailValidatorStub: EmailValidator
  updateAccountStub: UpdateAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const updateAccountStub = makeUpdateAccount()
  const sut = new UpdateDataController(emailValidatorStub, updateAccountStub)

  return {
    sut,
    emailValidatorStub,
    updateAccountStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name'
  },
  user: {
    id: 'any_id'
  }
})

describe('UpdateData Controller', () => {
  test('should return 400 status if a blocked field has been provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'any_password'
      },
      user: {
        id: 'any_id'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
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

  test('should return 400 status if account has been not updated', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'updateData').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 400 status if provided fields are invalid', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'updateData').mockImplementationOnce(async () => {
      return Promise.reject(new InvalidParamError('id'))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('id')))
  })
})
