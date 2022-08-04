import env from '../../config/env'
import { SignInController } from '../../../presentation/controllers/signin/signin-controller'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignInValidation } from './signin-validation-factory'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'

export const makeSignInController = (): Controller => {
  const salt = 12
  const validation = makeSignInValidation()
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signInController = new SignInController(dbAuthentication, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signInController, logMongoRepository)
}
