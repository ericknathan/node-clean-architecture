import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSignInController, makeSignUpController } from '../../factories'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeSignInController()))
}
