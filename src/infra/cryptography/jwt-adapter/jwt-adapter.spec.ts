import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const secret = 'secret'
const expectedToken = 'any_token'
const userId = 'any_id'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => expectedToken
}))

const makeSut = (): JwtAdapter => new JwtAdapter(secret)

describe('Jwt Adapter', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt(userId)
    expect(signSpy).toHaveBeenCalledWith({ id: userId }, secret)
  })

  test('should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt(userId)
    expect(accessToken).toBe(expectedToken)
  })

  test('should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt(userId)
    await expect(promise).rejects.toThrow()
  })
})
