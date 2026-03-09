import axios, { type AxiosInstance } from 'axios'
import type { GatewayInterface, ChargeParams, ChargeResult } from './gateway_interface_service.js'
import env from '#start/env'

export default class Gateway1Service implements GatewayInterface {
  name = 'gateway1'
  private client: AxiosInstance
  private email: string
  private token: string
  private authToken: string | null = null

  constructor() {
    const baseURL = env.get('GATEWAY1_URL', 'http://localhost:3001')
    this.email = env.get('GATEWAY1_EMAIL', 'dev@betalent.tech')
    this.token = env.get('GATEWAY1_TOKEN') ?? ''

    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  private async authenticate(): Promise<string> {
    if (this.authToken) {
      return this.authToken
    }

    const response = await this.client.post('/login', {
      email: this.email,
      token: this.token,
    })

    this.authToken = response.data.token
    return this.authToken!
  }

  async charge(params: ChargeParams): Promise<ChargeResult> {
    const token = await this.authenticate()

    const response = await this.client.post(
      '/transactions',
      {
        amount: params.amount,
        name: params.name,
        email: params.email,
        cardNumber: params.cardNumber,
        cvv: params.cvv,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    return {
      externalId: response.data.id,
      cardLastNumbers: params.cardNumber.slice(-4),
    }
  }

  async refund(externalId: string): Promise<void> {
    const token = await this.authenticate()

    await this.client.post(
      `/transactions/${externalId}/charge_back`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  }
}
