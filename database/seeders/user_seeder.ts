import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        name: 'Admin User',
        email: 'admin@betalent.tech',
        password: 'password123',
        role: 'ADMIN',
      },
      {
        name: 'Manager User',
        email: 'manager@betalent.tech',
        password: 'password123',
        role: 'MANAGER',
      },
      {
        name: 'Finance User',
        email: 'finance@betalent.tech',
        password: 'password123',
        role: 'FINANCE',
      },
      {
        name: 'Regular User',
        email: 'user@betalent.tech',
        password: 'password123',
        role: 'USER',
      },
    ])
  }
}
