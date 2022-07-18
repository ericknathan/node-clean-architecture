import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { DbGetAccount } from '../../data/usecases/get-account/db-get-account'
import { CryptoAdapter } from '../../infra/cryptography/crypto/crypto-adapter'
import { LogKnexRepository } from '../../infra/db/knex/log-repository/log'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cryptographyAdapter = new CryptoAdapter()
  const dbAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(cryptographyAdapter, dbAccountRepository)
  const dbGetAccount = new DbGetAccount(dbAccountRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, dbGetAccount)
  const errorLoggerRepository = new LogMongoRepository()
  const activityLoggerRepository = new LogKnexRepository()
  return new LogControllerDecorator(signUpController, errorLoggerRepository, activityLoggerRepository)
}
