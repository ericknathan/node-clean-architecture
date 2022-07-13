import { NextFunction, Request, Response } from 'express'
import { unauthorizedError } from '../../../presentation/helpers/http-helper'
import { HttpResponse } from '../../../presentation/protocols'
import { makeJwtCryptographer } from '../../factories/cryptography'

export const ensureAuthenticated = async (request: Request, response: Response, next: NextFunction): Promise<HttpResponse> => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    next()
    return unauthorizedError()
  }

  const [, token] = authHeader.split(' ')

  try {
    const jwtCryptographer = makeJwtCryptographer()
    const userId = await jwtCryptographer.decrypt(token)

    request.user = {
      id: userId
    }

    next()
  } catch {
    next()
    return unauthorizedError()
  }
}
