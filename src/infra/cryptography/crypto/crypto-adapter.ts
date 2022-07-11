import crypto from 'crypto'
import { Encrypter } from '../../../data/protocols/encrypter'

export class CryptoAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    const hash = crypto.createHash('sha256').update(value).digest('hex')
    return hash
  }
}
