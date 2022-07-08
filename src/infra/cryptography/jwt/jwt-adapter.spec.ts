import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const secret = 'fake_secret'
const expiresIn = '30d'
const userId = 'any_id'
const hashedToken = 'hashed_token'

jest.mock('jsonwebtoken', () => ({
  sign (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string {
    return hashedToken
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt(userId)
    expect(hashSpy).toHaveBeenCalledWith({}, secret, {
      subject: userId,
      expiresIn: expiresIn
    })
  })
})
