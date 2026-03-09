import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import TransactionProduct from './transaction_product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare amount: number

  @hasMany(() => TransactionProduct)
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async getAll() {
    return Product.all()
  }

  static async getById(id: number) {
    return Product.findOrFail(id)
  }

  static async createProduct(data: { name: string; amount: number }) {
    return Product.create(data)
  }

  static async updateProduct(id: number, data: Partial<{ name: string; amount: number }>) {
    const product = await Product.findOrFail(id)
    product.merge(data)
    await product.save()
    return product
  }

  static async deleteProduct(id: number) {
    const product = await Product.findOrFail(id)
    await product.delete()
  }
}
