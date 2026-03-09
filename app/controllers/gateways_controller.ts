import Gateway from '#models/gateway'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async toggle({ params, response }: HttpContext) {
    return response.ok(await Gateway.toggle(params.id))
  }

  async updatePriority({ params, request, response }: HttpContext) {
    const { priority } = request.only(['priority'])
    return response.ok(await Gateway.updatePriority(params.id, priority))
  }
}
