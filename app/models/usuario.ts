import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Grupo from './grupo.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare senha: string

  @column.dateTime({ autoCreate: true })
  declare dataCadastro: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare dataAtualizacao: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(Usuario)

  @manyToMany(() => Grupo, {
    pivotTable: 'grupo_usuario',
    pivotTimestamps: {
      createdAt: 'data_cadastro',
      updatedAt: 'data_atualizacao'
    },
    localKey: 'id',
    pivotForeignKey: 'usuario_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'grupo_id',
  })
  declare grupos: ManyToMany<typeof Grupo>
} 