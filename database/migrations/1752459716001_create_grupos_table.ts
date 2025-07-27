import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Grupos extends BaseSchema {
  protected tableName = 'grupos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('nome').nullable()

      table.timestamp('data_cadastro')
      table.timestamp('data_atualizacao')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}