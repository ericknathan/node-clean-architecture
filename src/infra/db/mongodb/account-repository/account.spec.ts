import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const accountId = '62cc5a48fc19c53ee9c22079'
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

  test('should not return an account by id if cannot be found account', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    await sut.add(fakeAccountData)
    const getAccountByIdPromise = sut.getById(accountId)

    await expect(getAccountByIdPromise).rejects.toThrow()
  })

  test('should return an account by id', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    const createdAccount = await sut.add(fakeAccountData)
    const account = await sut.getById(createdAccount.id)

    expect(account).toBeTruthy()
    expect(account.id).toBe(createdAccount.id)
  })

  test('should update data from account', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    const createdAccount = await sut.add(fakeAccountData)

    const email = 'test@example.com'
    const accountHasBeenUpdated = await sut.updateData(createdAccount.id, { email })
    const updatedAccount = await sut.getById(createdAccount.id)

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(updatedAccount.email).toBe(email)
  })

  test('should update password from account', async () => {
    const sut = makeSut()
    const fakeAccountData = makeFakeAccountData()
    const createdAccount = await sut.add(fakeAccountData)

    const accountHasBeenUpdated = await sut.updatePassword(createdAccount.id, 'new_password')
    const updatedAccount = await sut.getById(createdAccount.id)

    expect(accountHasBeenUpdated).toBeTruthy()
    expect(createdAccount.password).not.toBe(updatedAccount.password)
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

  test('should not update data from account if provided id is invalid', async () => {
    const sut = makeSut()

    const accountHasBeenUpdatedPromise = sut.updateData('invalid_id', { email: 'test@example.com' })

    await expect(accountHasBeenUpdatedPromise).rejects.toThrow()
  })

  test('should not update data from account if provided id is not registered in database', async () => {
    const sut = makeSut()
    jest.spyOn(accountCollection, 'findOne').mockImplementationOnce(null)

    const accountHasBeenUpdatedPromise = sut.updateData('62cd8b4e5f4eff0d61202bbf', { email: 'test@example.com' })

    await expect(accountHasBeenUpdatedPromise).rejects.toThrow()
  })
})
