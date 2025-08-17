import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagamentos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('grupo_id').unsigned().references('grupos.id').onDelete('CASCADE').notNullable()
      table.integer('pagador_id').unsigned().references('usuarios.id').notNullable()
      table.integer('recebedor_id').unsigned().references('usuarios.id').notNullable()
      table.decimal('valor', 10, 2).notNullable()
      table.string('descricao').nullable()
      table.date('data').notNullable()

      table.timestamp('data_cadastro').notNullable()
      table.timestamp('data_atualizacao').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}