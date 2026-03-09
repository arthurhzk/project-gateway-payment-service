import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  @column()
  declare priority: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async getActiveOrderedByPriority() {
    return Gateway.query().where('is_active', true).orderBy('priority', 'asc')
  }

  static async toggle(id: number) {
    const gateway = await Gateway.findOrFail(id)
    gateway.isActive = !gateway.isActive
    await gateway.save()
    return gateway
  }

  static async updatePriority(id: number, priority: number) {
    const gateway = await Gateway.findOrFail(id)
    gateway.priority = priority
    await gateway.save()
    return gateway
  }
}
