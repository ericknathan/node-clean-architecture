import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field')

  return {
    sut
  }
}

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
