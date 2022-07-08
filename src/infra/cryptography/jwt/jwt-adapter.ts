import { sign } from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secret: string
  private readonly expiresIn: string

  constructor (secret: string, expiresIn: string = '30d') {
    this.secret = secret
    this.expiresIn = expiresIn
  }

  async encrypt (userId: string): Promise<string> {
    return sign({}, this.secret, {
      subject: userId,
      expiresIn: this.expiresIn
    })
  }
}
