import { SignInController } from '../../presentation/controllers/signin/signin'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbAuthenticateAccount } from '../../data/usecases/authenticate-account/db-authenticate-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { AccessTokenMongoRepository } from '../../infra/db/mongodb/access-token-repository/access-token'
import { JwtAdapter } from '../../infra/cryptography/jwt/jwt-adapter'
import env from '../config/env'
import { CryptoAdapter } from '../../infra/cryptography/crypto/crypto-adapter'
import { LogKnexRepository } from '../../infra/db/knex/log-repository/log'

export const makeSignInController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cryptographyAdapter = new CryptoAdapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAccountRepository = new AccountMongoRepository()
  const dbAccessTokenRepository = new AccessTokenMongoRepository()
  const dbAuthenticateAccount = new DbAuthenticateAccount(dbAccountRepository, cryptographyAdapter, jwtAdapter, dbAccessTokenRepository)
  const signInController = new SignInController(emailValidatorAdapter, dbAuthenticateAccount)
  const errorLoggerRepository = new LogMongoRepository()
  const activityLoggerRepository = new LogKnexRepository()
  return new LogControllerDecorator(signInController, errorLoggerRepository, activityLoggerRepository)
}
