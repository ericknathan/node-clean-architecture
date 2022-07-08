import bcrypt from 'bcrypt'
import { Comparer } from '../../../data/protocols/comparer'
import { Encrypter } from '../../../data/protocols/encrypter'

export class BCryptAdapter implements Encrypter, Comparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value , this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
