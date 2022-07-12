import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on register success', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    const account = await sut.add(fakeAccountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAccountData.name)
    expect(account.email).toBe(fakeAccountData.email)
    expect(account.password).toBe(fakeAccountData.password)
  })

  test('should return an account by email', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    await sut.add(fakeAccountData)
    const account = await sut.getByEmail(fakeAccountData.email)

    expect(account).toBeTruthy()
    expect(account.email).toBe(fakeAccountData.email)
  })

  test('should not return an account by email if not exists', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    const account = await sut.getByEmail(fakeAccountData.email)

    expect(account).toBeNull()
  })

  test('should not return an account if account credentials returns null', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    jest.spyOn(accountCollection, 'findOne').mockImplementationOnce(null)

    const account = await sut.getByCredentials(fakeAccountData.email, fakeAccountData.password)

    expect(account).toBeNull()
  })
})
