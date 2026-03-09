import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index({ response }: HttpContext) {
    return response.ok(await Client.getAll())
  }

  async show({ params, response }: HttpContext) {
    return response.ok(await Client.getByIdWithTransactions(params.id))
  }
}
