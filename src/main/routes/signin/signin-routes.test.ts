import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

describe('SignIn Routes', () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an accessToken on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)

    await request(app)
      .post('/api/signin')
      .send({
        email: 'erick.capito@hotmail.com',
        password: '123'
      })
      .expect(200)
  })
})
