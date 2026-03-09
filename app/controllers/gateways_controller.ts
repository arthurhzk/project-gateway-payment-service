import Gateway from '#models/gateway'
import { updatePriorityValidator } from '#validators/gateway'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async index({ response }: HttpContext) {
    return response.ok(await Gateway.all())
  }

  async toggle({ params, response }: HttpContext) {
    return response.ok(await Gateway.toggle(params.id))
  }

  async updatePriority({ params, request, response }: HttpContext) {
    const { priority } = await request.validateUsing(updatePriorityValidator)
    return response.ok(await Gateway.updatePriority(params.id, priority))
  }
}
