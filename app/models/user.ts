import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { column, beforeSave, BaseModel } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  static async getAll() {
    return User.all()
  }

  static async getById(id: number) {
    return User.findOrFail(id)
  }

  static async createUser(data: {
    name: string
    email: string
    password: string
    role?: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }) {
    return User.create(data)
  }

  static async updateUser(
    id: number,
    data: Partial<{
      name: string
      email: string
      password: string
      role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
    }>
  ) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  static async deleteUser(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
