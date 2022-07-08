import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from '../account-repository/account'
import { AccessTokenMongoRepository } from './access-token'

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Access Token Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccessTokenMongoRepository => {
    return new AccessTokenMongoRepository()
  }

  const makeAccountSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should update access token', async () => {
    const accessToken = 'any_token'
    const accountSut = makeAccountSut()
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()

    let account = await accountSut.add(fakeAccountData)
    await sut.update(account.id, accessToken)

    account = await accountSut.getByEmail(fakeAccountData.email)
    expect(account.accessToken).toBe(accessToken)
  })
})
