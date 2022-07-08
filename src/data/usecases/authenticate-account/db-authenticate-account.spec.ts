import { DbAuthenticateAccount } from './db-authenticate-account'
import { Comparer, Encrypter, GetAccountRepository, GetAccountRepositoryPayload, CredentialsModel } from './db-authenticate-account-protocols'

const makeGetAccountRepository = (): GetAccountRepository => {
  class GetAccountRepositoryStub implements GetAccountRepository {
    async getByEmail (email: string): Promise<GetAccountRepositoryPayload> {
      return Promise.resolve(makeFakeAccountData())
    }
  }

  return new GetAccountRepositoryStub()
}

const makeComparer = (): Comparer => {
  class ComparerStub implements Comparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_token')
    }
  }

  return new EncrypterStub()
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
  sut: DbAuthenticateAccount
  getAccountRepositoryStub: GetAccountRepository
  comparerStub: Comparer
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const getAccountRepositoryStub = makeGetAccountRepository()
  const comparerStub = makeComparer()
  const encrypterStub = makeEncrypter()
  const sut = new DbAuthenticateAccount(getAccountRepositoryStub, comparerStub, encrypterStub)

  return {
    sut,
    getAccountRepositoryStub,
    comparerStub,
    encrypterStub
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

    const authenticationPayload = await sut.authenticate(makeFakeCredentials())
    expect(authenticationPayload).toBeNull()
  })

  test('should call Comparer with correct values', async () => {
    const { sut, comparerStub } = makeSut()
    const comparerSpy = jest.spyOn(comparerStub, 'compare')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(comparerSpy).toHaveBeenCalledWith(credentials.password, 'hashed_password')
  })

  test('should throw if Comparer throws', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if Comparer returns false', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const authenticationPayload = await sut.authenticate(makeFakeCredentials())
    expect(authenticationPayload).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('should return correct data on success', async () => {
    const { sut } = makeSut()
    const authenticationPayload = await sut.authenticate(makeFakeCredentials())
    expect(authenticationPayload).toEqual({
      accessToken: 'hashed_token'
    })
  })
})
