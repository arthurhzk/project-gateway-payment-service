import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async store({ request, response }: HttpContext) {
    const { name, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ name, email, password })
    const token = await User.accessTokens.create(user)

    return response.created({
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
