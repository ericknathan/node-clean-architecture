import { sign } from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string,
    private readonly expiresIn: string = '30d'
  ) {}

  async encrypt (userId: string): Promise<string> {
    return sign({}, this.secret, {
      subject: userId,
      expiresIn: this.expiresIn
    })
  }
}
