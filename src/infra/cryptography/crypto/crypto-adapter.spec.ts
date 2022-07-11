import crypto from 'crypto'
import { CryptoAdapter } from './crypto-adapter'

const value = 'any_value'
const hashedValue = 'hashed_value'

type CryptoHashPayload = {
  update: (value: string) => {
    digest: () => string
  }
}

jest.mock('crypto', () => ({
  createHash (algorithm: string): CryptoHashPayload {
    return {
      update: jest.fn(() => ({
        digest: jest.fn(() => hashedValue)
      }))
    }
  }
}))

const makeSut = (): CryptoAdapter => {
  return new CryptoAdapter()
}

describe('Crypto Adapter', () => {
  test('should call crypto with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(crypto, 'createHash')
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith('sha256')
  })

  test('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt(value)
    expect(hash).toBe(hashedValue)
  })

  test('should throw if crypto throws', async () => {
    const sut = makeSut()
    jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt(value)
    await expect(promise).rejects.toThrow()
  })
})
