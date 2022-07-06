import { Express, Router } from 'express'
import fastGlob from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fastGlob.sync('**/src/main/routes/**.routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
  router.post('/signup', (request, response) => {
    response.json({ ok: 'ok' })
  })
}
