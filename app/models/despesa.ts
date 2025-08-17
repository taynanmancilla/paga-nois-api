import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import Grupo from './grupo.js'
import DespesaUsuario from './despesa_usuario.js'

export default class Despesa extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare agiotaId: number

  @column()
  declare grupoId: number

  @column()
  declare valor: number

  @column()
  declare descricao: string

  @column()
  declare tipoDivisao: 'igualmente' | 'porcentagem' | 'valor'

  @column()
  declare categoria: string

  @column.date()
  declare data: DateTime

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime

  @belongsTo(() => Usuario, {
    foreignKey: 'agiotaId'
  })
  declare agiota: BelongsTo<typeof Usuario>

  @belongsTo(() => Grupo, {
    foreignKey: 'grupoId'
  })
  declare grupo: BelongsTo<typeof Grupo>

  @hasMany(() => DespesaUsuario, {
    foreignKey: 'despesaId'
  })
  declare participantes: HasMany<typeof DespesaUsuario>
}