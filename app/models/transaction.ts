import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Client from './client.js'
import Gateway from './gateway.js'
import TransactionProduct from './transaction_product.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare gatewayId: number

  @column()
  declare externalId: string

  @column()
  declare status: 'pending' | 'paid' | 'refunded'

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @hasMany(() => TransactionProduct)
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
