import Knex, { Knex as KnexTypes } from 'knex'
import knexConfig from '../knexfile'

export const KnexHelper = {
  client: null as KnexTypes,

  async connect (): Promise<void> {
    this.client = Knex(knexConfig)
  },

  async disconnect () {
    await this.client.destroy()
    this.client = null
  },

  async getCollection (name: string): Promise<() => KnexTypes.QueryBuilder> {
    if (!this.client) {
      await this.connect()
    }

    return () => this.client(name)
  }
}
