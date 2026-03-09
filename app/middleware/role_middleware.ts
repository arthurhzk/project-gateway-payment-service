import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'
import type User from '#models/user'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, roles: string[]) {
    const user = auth.user as User

    if (!user || !roles.includes(user.role)) {
      return response.forbidden({ message: 'Acesso negado: permissão insuficiente' })
    }

    await next()
  }
}
