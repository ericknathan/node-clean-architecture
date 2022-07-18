import { KnexHelper } from '../helpers/knex-helper'
import { LogKnexRepository } from './log'
import { Knex } from 'knex'

const makeSut = (): LogKnexRepository => {
  return new LogKnexRepository()
}

describe('Log Knex Repository', () => {
  let logCollection: () => Knex.QueryBuilder

  beforeAll(async () => {
    await KnexHelper.connect()
  })

  afterAll(async () => {
    await KnexHelper.disconnect()
  })

  beforeEach(async () => {
    logCollection = await KnexHelper.getCollection('activities')
    await logCollection().delete()
  })

  test('should create an activity log on success', async () => {
    const sut = makeSut()
    await sut.logActivity('any_param', 'any_output')
    const [{ count }] = await logCollection().count({ count: '*' })
    expect(count).toBe(1)
  })
})
