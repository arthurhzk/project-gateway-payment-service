import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token.value!.release(),
    })
  }
}
