import { DbAuthenticateAccount } from './db-authenticate-account'
import { GetAccountRepository, GetAccountRepositoryPayload, CredentialsModel } from './db-authenticate-account-protocols'

const makeGetAccountRepository = (): GetAccountRepository => {
  class GetAccountRepositoryStub implements GetAccountRepository {
    async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccountData())
    }
  }

  return new GetAccountRepositoryStub()
}

const makeFakeAccountData = (): GetAccountRepositoryPayload => ({
  id: 'valid_id',
  name: 'valid_name',
  password: 'valid_password'
})

const makeFakeCredentials = (): CredentialsModel => ({
  email: 'any_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAuthenticateAccount
  getAccountRepositoryStub: GetAccountRepository
}

const makeSut = (): SutTypes => {
  const getAccountRepositoryStub = makeGetAccountRepository()
  const sut = new DbAuthenticateAccount(getAccountRepositoryStub)

  return {
    sut,
    getAccountRepositoryStub
  }
}

describe('DbAuthenticateAccount Usecase', () => {
  test('should call GetAccountRepository with correct email', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    const getAccountByEmailSpy = jest.spyOn(getAccountRepositoryStub, 'getByEmail')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  test('should throw GetAccountRepository throws', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    jest.spyOn(getAccountRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if GetAccountRepository returns null', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    jest.spyOn(getAccountRepositoryStub, 'getByEmail').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.authenticate(makeFakeCredentials())
    expect(account).toBeNull()
  })

  test.todo('should call Comparer with correct values')
  test.todo('should throw if Comparer throws')
  test.todo('should return null if Comparer returns false')
  test.todo('should call Encrypter with correct id')
  test.todo('should throw if Encrypter throw')
  test.todo('should return correct data on success')
})
