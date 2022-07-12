import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { GetAccountRepository } from '../../../../data/protocols/get-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { UpdateAccountDataRepositoryPayload, UpdateAccountRepository } from '../../../../data/protocols/update-account-repository'

export class AccountMongoRepository implements AddAccountRepository, GetAccountRepository, UpdateAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const { insertedId } = result
    const accountById = await accountCollection.findOne({ _id: insertedId })

    return MongoHelper.map(accountById) as AccountModel
  }

  async updateData (userId: string, newData: UpdateAccountDataRepositoryPayload): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const { acknowledged } = await accountCollection.updateOne(
      {
        _id: new ObjectId(userId)
      }, {
        $set: {
          ...newData
        }
      }
    )

    return acknowledged
  }

  async updatePassword (userId: string, newPassword: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const { acknowledged } = await accountCollection.updateOne(
      {
        _id: new ObjectId(userId)
      }, {
        $set: {
          password: newPassword
        }
      }
    )

    return acknowledged
  }

  async getById (userId: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountById = await accountCollection.findOne({ _id: new ObjectId(userId) })

    if (!accountById) return null

    return MongoHelper.map(accountById) as AccountModel
  }

  async getByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountByEmail = await accountCollection.findOne({ email })

    if (!accountByEmail) return null

    return MongoHelper.map(accountByEmail) as AccountModel
  }

  async getByCredentials (email: string, password: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountByCredentials = await accountCollection.findOne({ email, password })

    if (!accountByCredentials) return null

    return MongoHelper.map(accountByCredentials) as AccountModel
  }
}
