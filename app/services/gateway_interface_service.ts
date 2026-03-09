export interface ChargeParams {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface ChargeResult {
  externalId: string
  cardLastNumbers: string
}

export interface GatewayInterface {
  name: string
  charge(params: ChargeParams): Promise<ChargeResult>
  refund(externalId: string): Promise<void>
}
