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

describe('BCrypt Adapter Encrypter', () => {
  test('should call bcrypt encrypter with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('should return a hash on encrypter success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt(value)
    expect(hash).toBe(hashedValue)
  })

  test('should throw if bcrypt encrypter throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt(value)
    await expect(promise).rejects.toThrow()
  })
})

describe('BCrypt Adapter Comparer', () => {
  test('should call bcrypt comparer with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare(value, hashedValue)
    expect(hashSpy).toHaveBeenCalledWith(value, hashedValue)
  })

  test('should return a boolean on comparer success', async () => {
    const sut = makeSut()
    const comparision = await sut.compare(value, hashedValue)
    expect(typeof comparision === 'boolean').toBeTruthy()
  })

  test('should throw if bcrypt comparer throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare(value, hashedValue)
    await expect(promise).rejects.toThrow()
  })
})
