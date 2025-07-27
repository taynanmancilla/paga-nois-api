import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class Grupo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string | null

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime

  @manyToMany(() => Usuario, {
    pivotTable: 'grupo_usuario',
    pivotTimestamps: {
      createdAt: 'data_cadastro',
      updatedAt: 'data_atualizacao'
    },
    localKey: 'id',
    pivotForeignKey: 'grupo_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'usuario_id',
  })
  declare grupos: ManyToMany<typeof Usuario>
}