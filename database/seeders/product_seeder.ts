import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.updateOrCreateMany('name', [
      { name: 'Produto A', amount: 1000 },
      { name: 'Produto B', amount: 2500 },
      { name: 'Produto C', amount: 500 },
    ])
  }
}
