import { JwtAdapter } from '../../infra/cryptography/jwt/jwt-adapter'
import env from '../config/env'

export const makeJwtCryptographer = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}
