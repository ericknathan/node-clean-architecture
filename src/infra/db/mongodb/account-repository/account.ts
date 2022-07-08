import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { GetAccountRepository } from '../../../../data/protocols/get-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, GetAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const { insertedId } = result
    const accountById = await accountCollection.findOne({ _id: insertedId })

    return MongoHelper.map(accountById) as AccountModel
  }

  async getByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountByEmail = await accountCollection.findOne({ email })

    return MongoHelper.map(accountByEmail) as AccountModel
  }
}
