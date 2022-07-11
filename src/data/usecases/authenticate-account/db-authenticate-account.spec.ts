import { AccessTokenRepository } from '../../protocols/access-token-repository'
import { DbAuthenticateAccount } from './db-authenticate-account'
import { Encrypter, GetAccountRepository, GetAccountRepositoryPayload, CredentialsModel } from './db-authenticate-account-protocols'

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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_token')
    }
  }

  return new EncrypterStub()
}

const makeAccessTokenRepository = (): AccessTokenRepository => {
  class AccessTokenRepositoryStub implements AccessTokenRepository {
    async update (accountId: string, accessToken: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AccessTokenRepositoryStub()
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
  passwordComparerStub: Encrypter
  tokenEncrypterStub: Encrypter
  accessTokenRepositoryStub: AccessTokenRepository
}

const makeSut = (): SutTypes => {
  const getAccountRepositoryStub = makeGetAccountRepository()
  const passwordComparerStub = makeEncrypter()
  const tokenEncrypterStub = makeEncrypter()
  const accessTokenRepositoryStub = makeAccessTokenRepository()
  const sut = new DbAuthenticateAccount(getAccountRepositoryStub, passwordComparerStub, tokenEncrypterStub, accessTokenRepositoryStub)

  return {
    sut,
    getAccountRepositoryStub,
    passwordComparerStub,
    tokenEncrypterStub,
    accessTokenRepositoryStub
  }
}

describe('DbAuthenticateAccount Usecase', () => {
  test('should call GetAccountRepository with correct email', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    const getAccountByEmailSpy = jest.spyOn(getAccountRepositoryStub, 'getByCredentials')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(getAccountByEmailSpy).toHaveBeenCalledWith(credentials.email, 'hashed_token')
  })

  test('should return UnauthorizedError if GetAccountRepository returns null', async () => {
    const { sut, getAccountRepositoryStub } = makeSut()
    jest.spyOn(getAccountRepositoryStub, 'getByCredentials').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('should call Comparer with correct values', async () => {
    const { sut, passwordComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(passwordComparerStub, 'encrypt')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(comparerSpy).toHaveBeenCalledWith(credentials.password)
  })

  test('should throw if Comparer throws', async () => {
    const { sut, passwordComparerStub } = makeSut()
    jest.spyOn(passwordComparerStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, tokenEncrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(tokenEncrypterStub, 'encrypt')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, tokenEncrypterStub } = makeSut()
    jest.spyOn(tokenEncrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

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

  test('should call AccessTokenRepository with correct values', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(accessTokenRepositoryStub, 'update')

    const credentials = makeFakeCredentials()
    await sut.authenticate(credentials)
    expect(updateSpy).toHaveBeenCalledWith('valid_id', 'hashed_token')
  })

  test('should throw if AccessTokenRepository throws', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    jest.spyOn(accessTokenRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.authenticate(makeFakeCredentials())
    await expect(promise).rejects.toThrow()
  })
})
