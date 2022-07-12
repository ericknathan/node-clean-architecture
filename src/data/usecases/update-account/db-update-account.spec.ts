import { DbUpdateAccount } from './db-update-account'
import { Comparer, Encrypter, AccountModel, UpdateAccountRepository, UpdateAccountDataRepositoryPayload, GetAccountRepository, GetAccountRepositoryPayload } from './db-update-account-protocols'

type CryptographyRepository = Comparer & Encrypter

const makeCriptographer = (): CryptographyRepository => {
  class CryptographerStub implements CryptographyRepository {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }

    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  return new CryptographerStub()
}
type AccountRepository = UpdateAccountRepository & GetAccountRepository

const makeAccountRepository = (): AccountRepository => {
  class UpdateAccountRepositoryStub implements AccountRepository {
    async updateData (userId: string, newData: UpdateAccountDataRepositoryPayload): Promise<boolean> {
      return Promise.resolve(true)
    }

    async updatePassword (userId: string, newPassword: string): Promise<boolean> {
      return Promise.resolve(true)
    }

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
  cryptographerStub: CryptographyRepository
  accountRepositoryStub: AccountRepository
}

const makeSut = (): SutTypes => {
  const cryptographerStub = makeCriptographer()
  const accountRepositoryStub = makeAccountRepository()
  const sut = new DbUpdateAccount(cryptographerStub, accountRepositoryStub)

  return {
    sut,
    cryptographerStub,
    accountRepositoryStub
  }
}

describe('DbUpdateAccount Usecase', () => {
  const fakeId = 'valid_id'
  const name = 'new_name'
  const currentPassword = 'any_password'
  const newPassword = 'new_password'

  test('should call UpdateAccountRepository updateData function with correct values', async () => {
    const { sut, accountRepositoryStub } = makeSut()
    const updateAccountDataSpy = jest.spyOn(accountRepositoryStub, 'updateData')

    const accountHasBeenUpdated = await sut.updateData(fakeId, { name })

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(updateAccountDataSpy).toHaveBeenCalledWith(fakeId, { name })
  })

  test('should call UpdateAccountRepository updatePassword function with correct values', async () => {
    const { sut, accountRepositoryStub, cryptographerStub } = makeSut()
    const updateAccountPasswordSpy = jest.spyOn(accountRepositoryStub, 'updatePassword')

    const accountHasBeenUpdated = await sut.updatePassword(fakeId, { currentPassword, newPassword })

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(updateAccountPasswordSpy).toHaveBeenCalledWith(fakeId, await cryptographerStub.encrypt(newPassword))
  })

  test('should call UpdateAccountRepository updatePassword function with incorrect passwords', async () => {
    const { sut, cryptographerStub } = makeSut()
    jest.spyOn(cryptographerStub, 'compare').mockImplementationOnce(async () => Promise.resolve(false))

    const accountHasBeenUpdated = sut.updatePassword(fakeId, { currentPassword, newPassword })

    await expect(accountHasBeenUpdated).rejects.toThrow()
  })
})
