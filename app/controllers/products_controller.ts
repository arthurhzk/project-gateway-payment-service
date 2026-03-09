import Product from '#models/product'
import TransactionProduct from '#models/transaction_product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ response }: HttpContext) {
    return response.ok(await Product.getAll())
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    return response.created(await Product.createProduct(data))
  }

  async show({ params, response }: HttpContext) {
    return response.ok(await Product.getById(params.id))
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateProductValidator)
    return response.ok(await Product.updateProduct(params.id, data))
  }

  async destroy({ params, response }: HttpContext) {
    const hasTransactions = await TransactionProduct.query().where('product_id', params.id).first()

    if (hasTransactions) {
      return response.conflict({
        message: 'Produto não pode ser excluído pois possui transações vinculadas',
      })
    }

    await Product.deleteProduct(params.id)
    return response.ok({ message: 'Produto excluído com sucesso' })
  }
}
