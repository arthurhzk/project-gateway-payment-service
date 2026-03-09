import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ response }: HttpContext) {
    return response.ok(await User.getAll())
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    return response.created(await User.createUser(data))
  }

  async show({ params, response }: HttpContext) {
    return response.ok(await User.getById(params.id))
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateUserValidator)
    return response.ok(await User.updateUser(params.id, data))
  }

  async destroy({ params, response }: HttpContext) {
    await User.deleteUser(params.id)
    return response.ok({ message: 'Usuário excluído com sucesso' })
  }
}
