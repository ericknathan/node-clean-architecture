import { ObjectId } from 'mongodb'
import { AccessTokenRepository } from '../../../../data/protocols/access-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccessTokenMongoRepository implements AccessTokenRepository {
  async update (accountId: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      {
        _id: new ObjectId(accountId)
      }, {
        $set: {
          accessToken
        }
      }
    )
  }
}
