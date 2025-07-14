import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GrupoUsuarios extends BaseSchema {
  protected tableName = 'grupo_usuario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('usuario_id').unsigned().references('usuarios.id')
      table.integer('grupo_id').unsigned().references('grupos.id')
      table.unique(['usuario_id', 'grupo_id'])
      table.timestamp('data_cadastro')
      table.timestamp('data_atualizacao')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}