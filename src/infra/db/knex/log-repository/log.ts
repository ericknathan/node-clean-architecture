import { LogActivityRepository } from '../../../../data/protocols/log-activity-repository'
import { KnexHelper } from '../helpers/knex-helper'

export class LogKnexRepository implements LogActivityRepository {
  async logActivity (input: any, output: any): Promise<void> {
    const activityCollection = await KnexHelper.getCollection('activities')
    await activityCollection().insert({
      input: typeof input === 'object' ? JSON.stringify(input) : input,
      output: typeof output === 'object' ? JSON.stringify(output) : output
    })
  }
}
