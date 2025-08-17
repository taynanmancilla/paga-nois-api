import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'
import Grupo from './grupo.js'

export default class Pagamento extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare grupoId: number

  @column()
  declare pagadorId: number

  @column()
  declare recebedorId: number

  @column()
  declare valor: number

  @column()
  declare descricao: string | null

  @column.date()
  declare data: DateTime

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime

  @belongsTo(() => Usuario, {
    foreignKey: 'pagadorId'
  })
  declare pagador: BelongsTo<typeof Usuario>

  @belongsTo(() => Usuario, {
    foreignKey: 'recebedorId'
  })
  declare recebedor: BelongsTo<typeof Usuario>

  @belongsTo(() => Grupo, {
    foreignKey: 'grupoId'
  })
  declare grupo: BelongsTo<typeof Grupo>
}