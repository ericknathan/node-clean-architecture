import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('activities', (table) => {
    table.increments('id').unique()
    table.text('input').notNullable()
    table.text('output')
    table.timestamp('date').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('activities')
}
