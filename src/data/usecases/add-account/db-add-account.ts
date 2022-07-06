import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepositoryStub: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepositoryStub: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepositoryStub = addAccountRepositoryStub
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    console.log({ hashedPassword })
    await this.addAccountRepositoryStub.add(Object.assign({}, accountData, { password: hashedPassword }))
    return Promise.resolve(null)
  }
}
