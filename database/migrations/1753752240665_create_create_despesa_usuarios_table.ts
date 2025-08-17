import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'despesa_usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('despesa_id').unsigned().references('despesas.id').onDelete('CASCADE').notNullable()
      table.integer('usuario_id').unsigned().references('usuarios.id').notNullable()
      table.decimal('valor_devido', 10, 2).notNullable()
      table.boolean('pago').defaultTo(false)

      table.timestamp('data_cadastro').notNullable()
      table.timestamp('data_atualizacao').nullable()

      table.unique(['despesa_id', 'usuario_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}