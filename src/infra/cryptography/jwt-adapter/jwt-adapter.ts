import { sign } from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    sign({ id: value }, this.secret)
    return null
  }
}
