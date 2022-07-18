import { KnexHelper as sut } from './knex-helper'

describe('Knex Helper', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if knex is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()

    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
