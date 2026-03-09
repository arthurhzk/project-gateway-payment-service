import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gateway.updateOrCreateMany('name', [
      {
        name: 'gateway1',
        isActive: true,
        priority: 1,
      },
      {
        name: 'gateway2',
        isActive: true,
        priority: 2,
      },
    ])
  }
}
