import { DbGetAccount } from './db-get-account'
import { CredentialsModel, GetAccountRepository, GetAccountRepositoryPayload } from './db-get-account-protocols'

const makeGetAccountRepository = (): GetAccountRepository => {
  class GetAccountRepositoryStub implements GetAccountRepository {
    async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccountData())
    }

    async getByCredentials (email: string, password: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccountData())
    }
  }

  return new GetAccountRepositoryStub()
}

const makeFakeAccountData = (): GetAccountRepositoryPayload => ({
  id: 'valid_id',
  name: 'valid_name',
  password: 'hashed_password'
})

const makeFakeCredentials = (): CredentialsModel => ({
  email: 'any_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbGetAccount
  getAccountRepositoryStub: GetAccountRepository
}

const makeSut = (): SutTypes => {
  const getAccountRepositoryStub = makeGetAccountRepository()
  const sut = new DbGetAccount(getAccountRepositoryStub)

  return {
    sut,
    getAccountRepositoryStub
  }
}

describe('DbGetAccount Usecase', () => {
  test('should call GetAccountRepository getByCredentials function with correct credentials', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    const getAccountByCredentialsSpy = jest.spyOn(getAccountRepositoryStub, 'getByCredentials')

    const { email, password } = makeFakeCredentials()
    await sut.getByCredentials(email, password)
    expect(getAccountByCredentialsSpy).toHaveBeenCalledWith(email, password)
  })

  test('should call GetAccountRepository getByEmail function with correct email', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    const getAccountByEmailSpy = jest.spyOn(getAccountRepositoryStub, 'getByEmail')

    const { email } = makeFakeCredentials()
    await sut.getByEmail(email)
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(email)
  })
})
