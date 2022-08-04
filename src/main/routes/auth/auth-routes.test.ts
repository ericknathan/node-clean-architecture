import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeAll(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('[POST] /signup', () => {
    test('should return 200 status on signup', async () => {
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
  })

  describe('[POST] /signin', () => {
    test('should return 200 status on signin', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'erick.capito@hotmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
