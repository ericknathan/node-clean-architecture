import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

const salt = 12
const value = 'any_value'
const hashedValue = 'hashed_value'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve(hashedValue)
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt(value)
    expect(hash).toBe(hashedValue)
  })
})
