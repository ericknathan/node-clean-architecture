import { sign, verify } from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/encrypter'
import { Decrypter } from '../../../data/protocols/decrypter'

type DecryptPayload = {
  sub: string
}

export class JwtAdapter implements Encrypter, Decrypter {
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

  async decrypt (value: string): Promise<string> {
    const { sub: userId } = verify(value, this.secret) as DecryptPayload
    return Promise.resolve(userId)
  }
}
