import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Transaction from './transaction.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async getAll() {
    return Client.all()
  }

  static async getByIdWithTransactions(id: number) {
    return Client.query()
      .where('id', id)
      .preload('transactions', (q) => {
        q.preload('transactionProducts', (tq) => tq.preload('product'))
        q.preload('gateway')
      })
      .firstOrFail()
  }

  static async findOrCreateByEmail(name: string, email: string) {
    let client = await Client.findBy('email', email)
    if (!client) {
      client = await Client.create({ name, email })
    }
    return client
  }
}
