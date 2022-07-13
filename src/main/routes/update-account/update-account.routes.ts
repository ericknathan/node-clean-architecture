import { Router } from 'express'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { makeUpdateAccountDataController, makeUpdateAccountPasswordController } from '../../factories/update-account'
import { ensureAuthenticated } from '../../middlewares/authentication'
const prefix = '/account/update'

export default (router: Router): void => {
  router.put(`${prefix}/data`, ensureAuthenticated, adaptRoute(makeUpdateAccountDataController()))
  router.put(`${prefix}/password`, ensureAuthenticated, adaptRoute(makeUpdateAccountPasswordController()))
}
