import { UpdateDataController } from '../../presentation/controllers/update-account/update-data/update-data'
import { UpdatePasswordController } from '../../presentation/controllers/update-account/update-password/update-password'
import { EmailValidatorAdapter } from '../../utils/validators/email/email-validator-adapter'
import { DbUpdateAccount } from '../../data/usecases/update-account/db-update-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { CryptoAdapter } from '../../infra/cryptography/crypto/crypto-adapter'
import { LogKnexRepository } from '../../infra/db/knex/log-repository/log'

export const makeUpdateAccountDataController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const cryptographyAdapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(cryptographyAdapter, accountMongoRepository)
  const updateAccountDataController = new UpdateDataController(emailValidatorAdapter, dbUpdateAccount)
  const errorLoggerRepository = new LogMongoRepository()
  const activityLoggerRepository = new LogKnexRepository()
  return new LogControllerDecorator(updateAccountDataController, errorLoggerRepository, activityLoggerRepository)
}

export const makeUpdateAccountPasswordController = (): Controller => {
  const cryptographyAdapter = new CryptoAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(cryptographyAdapter, accountMongoRepository)
  const updateAccountPasswordController = new UpdatePasswordController(dbUpdateAccount)
  const errorLoggerRepository = new LogMongoRepository()
  const activityLoggerRepository = new LogKnexRepository()
  return new LogControllerDecorator(updateAccountPasswordController, errorLoggerRepository, activityLoggerRepository)
}
