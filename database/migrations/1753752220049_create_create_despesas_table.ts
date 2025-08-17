import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'despesas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('agiota_id').unsigned().references('usuarios.id').notNullable()
      table.integer('grupo_id').unsigned().references('grupos.id').onDelete('CASCADE').notNullable()
      table.decimal('valor', 10, 2).notNullable()
      table.string('descricao').notNullable()
      table.enum('tipo_divisao', ['igualmente', 'porcentagem', 'valor']).notNullable()
      table.string('categoria').notNullable()
      table.date('data').notNullable()

      table.timestamp('data_cadastro').notNullable()
      table.timestamp('data_atualizacao').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}