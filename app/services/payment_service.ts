import Gateway from '#models/gateway'
import Gateway1Service from './gateway_1_service.js'
import Gateway2Service from './gateway_2_service.js'
import type { GatewayInterface, ChargeParams } from './gateway_interface_service.js'

interface PaymentChargeParams {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

interface PaymentChargeResult {
  gatewayId: number
  externalId: string
  cardLastNumbers: string
}

export default class PaymentService {
  private gatewayServices: Map<string, GatewayInterface>

  constructor() {
    this.gatewayServices = new Map()
    this.gatewayServices.set('gateway1', new Gateway1Service())
    this.gatewayServices.set('gateway2', new Gateway2Service())
  }

  async charge(params: PaymentChargeParams): Promise<PaymentChargeResult> {
    const gateways = await Gateway.getActiveOrderedByPriority()

    if (gateways.length === 0) {
      throw new Error('No active payment gateways available')
    }

    const errors: string[] = []

    for (const gateway of gateways) {
      const service = this.gatewayServices.get(gateway.name)
      if (!service) {
        errors.push(`Gateway ${gateway.name}: service not implemented`)
        continue
      }

      try {
        const chargeParams: ChargeParams = {
          amount: params.amount,
          name: params.name,
          email: params.email,
          cardNumber: params.cardNumber,
          cvv: params.cvv,
        }

        const result = await service.charge(chargeParams)

        return {
          gatewayId: gateway.id,
          externalId: result.externalId,
          cardLastNumbers: result.cardLastNumbers,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        errors.push(`Gateway ${gateway.name}: ${errorMessage}`)
        continue
      }
    }

    throw new Error(`All payment gateways failed: ${errors.join('; ')}`)
  }

  async refund(gatewayName: string, externalId: string): Promise<void> {
    const service = this.gatewayServices.get(gatewayName)
    if (!service) {
      throw new Error(`Gateway ${gatewayName} service not implemented`)
    }

    await service.refund(externalId)
  }
}
