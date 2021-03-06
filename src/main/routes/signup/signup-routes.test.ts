import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

describe('SignUp Routes', () => {
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

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })

  test('should return 403 status if provided email is already in use', async () => {
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
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(403)
  })
})
