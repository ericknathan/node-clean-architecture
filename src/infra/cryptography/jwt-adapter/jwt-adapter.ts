import { sign } from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = sign({ id: value }, this.secret)
    return accessToken
  }
}
