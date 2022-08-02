import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

const salt = 12
const value = 'any_value'
const hashedValue = 'hashed_value'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve(hashedValue)
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash(value)
    expect(hash).toBe(hashedValue)
  })

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash(value)
    await expect(promise).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare(value, hashedValue)
    expect(compareSpy).toHaveBeenCalledWith(value, hashedValue)
  })

  test('should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare(value, hashedValue)
    expect(isValid).toBeTruthy()
  })
})
