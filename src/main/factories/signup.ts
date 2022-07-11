import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { DbGetAccount } from '../../data/usecases/get-account/db-get-account'
import { CryptoAdapter } from '../../infra/cryptography/crypto/crypto-adapter'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cryptoAdapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(cryptoAdapter, accountMongoRepository)
  const dbGetAccount = new DbGetAccount(accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, dbGetAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
