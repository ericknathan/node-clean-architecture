import { UpdateDataController } from '../../presentation/controllers/update-account/update-data/update-data'
import { UpdatePasswordController } from '../../presentation/controllers/update-account/update-password/update-password'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbUpdateAccount } from '../../data/usecases/update-account/db-update-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { CryptoAdapter } from '../../infra/cryptography/crypto/crypto-adapter'

export const makeUpdateAccountDataController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cryptoAdapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(cryptoAdapter, accountMongoRepository)
  const updateAccountDataController = new UpdateDataController(emailValidatorAdapter, dbUpdateAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(updateAccountDataController, logMongoRepository)
}

export const makeUpdateAccountPasswordController = (): Controller => {
  const cryptoAdapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(cryptoAdapter, accountMongoRepository)
  const updateAccountPasswordController = new UpdatePasswordController(dbUpdateAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(updateAccountPasswordController, logMongoRepository)
}
