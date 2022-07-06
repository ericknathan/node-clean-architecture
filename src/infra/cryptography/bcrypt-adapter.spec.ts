import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

const hashedValue = 'hashed_value'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve(hashedValue)
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const value = 'any_value'

    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('should return a hash on success', async () => {
    const salt = 12
    const value = 'any_value'

    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt(value)
    expect(hash).toBe(hashedValue)
  })
})
