import { SignInController } from '../../presentation/controllers/signin/signin'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbAuthenticateAccount } from '../../data/usecases/authenticate-account/db-authenticate-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { AccessTokenMongoRepository } from '../../infra/db/mongodb/access-token-repository/access-token'
import { JwtAdapter } from '../../infra/cryptography/jwt/jwt-adapter'
import env from '../config/env'

export const makeSignInController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const accessTokenRepository = new AccessTokenMongoRepository()
  const dbAuthenticateAccount = new DbAuthenticateAccount(accountMongoRepository, bcryptAdapter, jwtAdapter, accessTokenRepository)
  const signInController = new SignInController(emailValidatorAdapter, dbAuthenticateAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signInController, logMongoRepository)
}
