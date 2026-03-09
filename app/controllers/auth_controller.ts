import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ response }: HttpContext) {
    return response.ok({ message: 'Login endpoint' })
  }

  async logout({ response }: HttpContext) {
    return response.ok({ message: 'Logout endpoint' })
  }
}