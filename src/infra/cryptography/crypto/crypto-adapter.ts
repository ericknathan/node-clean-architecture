import crypto from 'crypto'
import { Comparer } from '../../../data/protocols/comparer'
import { Encrypter } from '../../../data/protocols/encrypter'

export class CryptoAdapter implements Encrypter, Comparer {
  async encrypt (value: string): Promise<string> {
    const hash = crypto.createHash('sha256').update(value).digest('hex')
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const hashedValue = await this.encrypt(value)
    return hashedValue === hash
  }
}
