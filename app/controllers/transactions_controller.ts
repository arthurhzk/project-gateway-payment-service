import Transaction from '#models/transaction'
import Client from '#models/client'
import Product from '#models/product'
import PaymentService from '#services/payment_service'
import { purchaseValidator } from '#validators/purchase'
import type { HttpContext } from '@adonisjs/core/http'

const paymentService = new PaymentService()

export default class TransactionsController {
  async index({ response }: HttpContext) {
    return response.ok(await Transaction.getAll())
  }

  async show({ params, response }: HttpContext) {
    return response.ok(await Transaction.getById(params.id))
  }

  async purchase({ request, response }: HttpContext) {
    const { clientName, clientEmail, cardNumber, cvv, products } =
      await request.validateUsing(purchaseValidator)

    const client = await Client.findOrCreateByEmail(clientName, clientEmail)

    let totalAmount = 0
    const productDetails: { product: Product; quantity: number }[] = []
    for (const item of products) {
      const product = await Product.findOrFail(item.id)
      totalAmount += product.amount * item.quantity
      productDetails.push({ product, quantity: item.quantity })
    }

    let paymentResult
    try {
      paymentResult = await paymentService.charge({
        amount: totalAmount,
        name: client.name,
        email: client.email,
        cardNumber,
        cvv,
      })
    } catch (err) {
      return response.serviceUnavailable({ message: err.message })
    }

    const transaction = await Transaction.createWithProducts({
      clientId: client.id,
      gatewayId: paymentResult.gatewayId,
      externalId: paymentResult.externalId,
      amount: totalAmount,
      cardLastNumbers: paymentResult.cardLastNumbers,
      products: productDetails,
    })

    await transaction.load('transactionProducts', (q) => q.preload('product'))
    await transaction.load('client')
    await transaction.load('gateway')

    return response.created(transaction.serialize())
  }

  async refund({ params, response }: HttpContext) {
    let transaction
    try {
      transaction = await Transaction.refundById(params.id)
    } catch (err) {
      return response.badRequest({ message: err.message })
    }

    await paymentService.refund(transaction.gateway.name, transaction.externalId)

    transaction.status = 'refunded'
    await transaction.save()

    return response.ok({ message: 'Reembolso realizado com sucesso', transaction })
  }
}
