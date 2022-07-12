import { Router } from 'express'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { makeUpdateAccountDataController, makeUpdateAccountPasswordController } from '../../factories/update-account'
const prefix = '/account/update/:id'

export default (router: Router): void => {
  router.put(`${prefix}/data`, adaptRoute(makeUpdateAccountDataController()))
  router.put(`${prefix}/password`, adaptRoute(makeUpdateAccountPasswordController()))
}
