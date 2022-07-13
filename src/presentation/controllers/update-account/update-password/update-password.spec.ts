import { UpdatePasswordController } from './update-password'
import { UnauthorizedError } from '../../../errors'
import { serverError, unauthorizedError } from '../../../helpers/http-helper'
import { HttpRequest, UpdateAccount, UpdateAccountPasswordModel } from './update-password-protocols'

const makeUpdateAccount = (): UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    updateData: () => Promise<boolean>

    async updatePassword (userId: string, passwords: UpdateAccountPasswordModel): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new UpdateAccountStub()
}

interface SutTypes {
  sut: UpdatePasswordController
  updateAccountStub: UpdateAccount
}

const makeSut = (): SutTypes => {
  const updateAccountStub = makeUpdateAccount()
  const sut = new UpdatePasswordController(updateAccountStub)

  return {
    sut,
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

describe('UpdatePassword Controller', () => {
  test('should return 400 status if current password not matches', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'updatePassword').mockImplementationOnce(async () => {
      return Promise.reject(new UnauthorizedError())
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorizedError())
  })

  test('should return 500 status if UpdateAccount throws', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'updatePassword').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
