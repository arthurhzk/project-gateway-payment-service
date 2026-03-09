import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.updateOrCreateMany('name', [
      { name: 'Product A', amount: 1000 },
      { name: 'Product B', amount: 2500 },
      { name: 'Product C', amount: 500 },
    ])
  }
}
