import request, { Response } from 'supertest'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

const makeUser = (): AddAccountModel => ({
  name: 'Erick',
  email: 'erick.capito@hotmail.com',
  password: '123',
  passwordConfirmation: '123'
})

const authenticateUser = async (user: AddAccountModel): Promise<string> => {
  const signInResponse = await request(app)
    .post('/api/signin')
    .send({
      email: user.email,
      password: user.password
    })

  const { accessToken } = signInResponse.body
  return accessToken
}

const signUpUser = async (user: AddAccountModel): Promise<Response> => {
  const response = await request(app)
    .post('/api/signup')
    .send(user)

  return response
}

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
    const user = makeUser()
    await signUpUser(user)
    const accessToken = await authenticateUser(user)

    await request(app)
      .put('/api/account/update/data')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Erick'
      })
      .expect(204)
  })

  test('should update account password', async () => {
    const user = makeUser()
    await signUpUser(user)
    const accessToken = await authenticateUser(user)

    await request(app)
      .put('/api/account/update/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: user.password,
        newPassword: '12345'
      })
      .expect(204)
  })

  test('should return 401 status code if password is incorrect', async () => {
    const user = makeUser()
    await signUpUser(user)
    const accessToken = await authenticateUser(user)

    await request(app)
      .put('/api/account/update/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: '1234',
        newPassword: '12345'
      })
      .expect(401)
  })
})
