import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import Despesa from './despesa.js'

export default class DespesaUsuario extends BaseModel {
  static table = 'despesa_usuarios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare despesaId: number

  @column()
  declare usuarioId: number

  @column()
  declare valorDevido: number

  @column()
  declare pago: boolean

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime

  @belongsTo(() => Usuario, {
    foreignKey: 'usuarioId'
  })
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => Despesa, {
    foreignKey: 'despesaId'
  })
  declare despesa: BelongsTo<typeof Despesa>
}
