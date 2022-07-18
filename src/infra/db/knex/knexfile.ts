import type { Knex } from 'knex'
import path from 'path'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '/dev.sqlite3')
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, '/migrations')
  },
  useNullAsDefault: true
}

export default config
