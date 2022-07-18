import { LogActivityRepository } from '../../data/protocols/log-activity-repository'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { serverError, ok } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeLogActivityRepository = (): LogActivityRepository => {
  class LogActivityRepositoryStub implements LogActivityRepository {
    async logActivity (input: any, output: any): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogActivityRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
  logActivityRepositoryStub: LogActivityRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const logActivityRepositoryStub = makeLogActivityRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub, logActivityRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
    logActivityRepositoryStub
  }
}
describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = makeFakeServerError()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(fakeError))

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith(fakeError.body.stack)
  })

  test('should call LogActivityRepository with http request and response', async () => {
    const { sut, logActivityRepositoryStub } = makeSut()
    const httpRequest = makeFakeRequest()

    const logSpy = jest.spyOn(logActivityRepositoryStub, 'logActivity')

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith(httpRequest, httpResponse)
  })
})
