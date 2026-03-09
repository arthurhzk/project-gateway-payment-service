import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Gateway from './gateway.js'
import TransactionProduct from './transaction_product.js'
import db from '@adonisjs/lucid/services/db'
import Product from './product.js'

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

  static async getAll() {
    return Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (q) => q.preload('product'))
  }

  static async getById(id: number) {
    return Transaction.query()
      .where('id', id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (q) => q.preload('product'))
      .firstOrFail()
  }

  static async createWithProducts(data: {
    clientId: number
    gatewayId: number
    externalId: string
    amount: number
    cardLastNumbers: string
    products: { product: Product; quantity: number }[]
  }) {
    return db.transaction(async (trx) => {
      const transaction = await Transaction.create(
        {
          clientId: data.clientId,
          gatewayId: data.gatewayId,
          externalId: data.externalId,
          status: 'paid',
          amount: data.amount,
          cardLastNumbers: data.cardLastNumbers,
        },
        { client: trx }
      )

      for (const { product, quantity } of data.products) {
        await TransactionProduct.create(
          {
            transactionId: transaction.id,
            productId: product.id,
            quantity,
            unitAmount: product.amount,
          },
          { client: trx }
        )
      }

      return transaction
    })
  }

  static async refundById(id: number) {
    const transaction = await Transaction.query().where('id', id).preload('gateway').firstOrFail()

    if (transaction.status === 'refunded') {
      throw new Error('Transação já foi reembolsada')
    }

    return transaction
  }
}
