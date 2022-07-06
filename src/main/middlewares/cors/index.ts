import { NextFunction, Request, Response } from 'express'

export const cors = (request: Request, response: Response, next: NextFunction): void => {
  response.set('access-control-allow-origin', '*')
  response.set('access-control-allow-methods', '*')
  response.set('access-control-allow-headers', '*')
  next()
}
