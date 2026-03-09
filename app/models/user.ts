import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { column, BaseModel } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider, AccessToken } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
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

  currentAccessToken?: AccessToken

  static accessTokens = DbAccessTokensProvider.forModel(User)

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
