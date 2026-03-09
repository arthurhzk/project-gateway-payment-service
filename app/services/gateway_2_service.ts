import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { GatewayInterface, ChargeParams, ChargeResult } from './gateway_interface_service.js'
import env from '#start/env'

export default class Gateway2Service implements GatewayInterface {
  name = 'gateway2'
  private client: AxiosInstance

  constructor() {
    const baseURL = env.get('GATEWAY2_URL', 'http://localhost:3002')
    const authToken = env.get('GATEWAY2_AUTH_TOKEN') ?? ''
    const authSecret = env.get('GATEWAY2_AUTH_SECRET') ?? ''

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Gateway-Auth-Token': authToken,
        'Gateway-Auth-Secret': authSecret,
      },
    })
  }

  async charge(params: ChargeParams): Promise<ChargeResult> {
    const response = await this.client.post('/transacoes', {
      valor: params.amount,
      nome: params.name,
      email: params.email,
      numeroCartao: params.cardNumber,
      cvv: params.cvv,
    })

    return {
      externalId: response.data.id,
      cardLastNumbers: params.cardNumber.slice(-4),
    }
  }

  async refund(externalId: string): Promise<void> {
    await this.client.post('/transacoes/reembolso', { id: externalId })
  }
}
