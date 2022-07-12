import { DbUpdateAccount } from './db-update-account'
import { Comparer, AccountModel, UpdateAccountRepository , GetAccountRepository, UpdateAccountDataRepositoryPayload, GetAccountRepositoryPayload } from './db-update-account-protocols'

const makeComparer = (): Comparer => {
  class ComparerStub implements Comparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

const makeGetAccountRepository = (): GetAccountRepository => {
  class GetAccountRepositoryStub implements GetAccountRepository {
    async getById (userId: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccount())
    }

    async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccount())
    }

    async getByCredentials (email: string, password: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new GetAccountRepositoryStub()
}

const makeUpdateAccountRepository = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateData (userId: string, newData: UpdateAccountDataRepositoryPayload): Promise<boolean> {
      return Promise.resolve(true)
    }

    async updatePassword (userId: string, newPassword: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new UpdateAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbUpdateAccount
  comparerStub: Comparer
  getAccountRepositoryStub: GetAccountRepository
  updateAccountRepositoryStub: UpdateAccountRepository
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparer()
  const updateAccountRepositoryStub = makeUpdateAccountRepository()
  const getAccountRepositoryStub = makeGetAccountRepository()
  const sut = new DbUpdateAccount(comparerStub, getAccountRepositoryStub, updateAccountRepositoryStub)

  return {
    sut,
    comparerStub,
    getAccountRepositoryStub,
    updateAccountRepositoryStub
  }
}

describe('DbUpdateAccount Usecase', () => {
  const fakeId = 'valid_id'
  const name = 'new_name'
  const currentPassword = 'any_password'
  const newPassword = 'new_password'

  test('should call UpdateAccountRepository updateData function with correct values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateAccountDataSpy = jest.spyOn(updateAccountRepositoryStub, 'updateData')

    const accountHasBeenUpdated = await sut.updateData(fakeId, { name })

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(updateAccountDataSpy).toHaveBeenCalledWith(fakeId, { name })
  })

  test('should call UpdateAccountRepository updatePassword function with correct values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateAccountPasswordSpy = jest.spyOn(updateAccountRepositoryStub, 'updatePassword')

    const accountHasBeenUpdated = await sut.updatePassword(fakeId, { currentPassword, newPassword })

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(updateAccountPasswordSpy).toHaveBeenCalledWith(fakeId, newPassword)
  })

  test('should call UpdateAccountRepository updatePassword function with incorrect passwords', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockImplementationOnce(async () => Promise.resolve(false))

    const accountHasBeenUpdated = await sut.updatePassword(fakeId, { currentPassword, newPassword })

    expect(accountHasBeenUpdated).toBeFalsy()
  })
})
