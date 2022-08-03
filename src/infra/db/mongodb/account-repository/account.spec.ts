import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const fakeAccountData = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  test('should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add(fakeAccountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAccountData.name)
    expect(account.email).toBe(fakeAccountData.email)
    expect(account.password).toBe(fakeAccountData.password)
  })

  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(fakeAccountData)
    const account = await sut.loadByEmail(fakeAccountData.email)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAccountData.name)
    expect(account.email).toBe(fakeAccountData.email)
    expect(account.password).toBe(fakeAccountData.password)
  })
})
