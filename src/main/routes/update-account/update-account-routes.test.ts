import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

describe('UpdateAccount Routes', () => {
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

  test('should update account data', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })

    const { id } = response.body

    await request(app)
      .put(`/api/account/update/${id}/data`)
      .send({
        name: 'Erick'
      })
      .expect(204)
  })

  test('should update account password', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })

    const { id } = response.body

    await request(app)
      .put(`/api/account/update/${id}/password`)
      .send({
        currentPassword: '123',
        newPassword: '12345'
      })
      .expect(204)
  })

  test('should return 401 status code if password is incorrect', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Erick',
        email: 'erick.capito@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      })

    const { id } = response.body

    await request(app)
      .put(`/api/account/update/${id}/password`)
      .send({
        currentPassword: '1234',
        newPassword: '12345'
      })
      .expect(401)
  })
})
