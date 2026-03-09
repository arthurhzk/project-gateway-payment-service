import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        name: 'Usuário Admin',
        email: 'admin@betalent.tech',
        password: 'password123',
        role: 'ADMIN',
      },
      {
        name: 'Usuário Gerente',
        email: 'manager@betalent.tech',
        password: 'password123',
        role: 'MANAGER',
      },
      {
        name: 'Usuário Financeiro',
        email: 'finance@betalent.tech',
        password: 'password123',
        role: 'FINANCE',
      },
      {
        name: 'Usuário Regular',
        email: 'user@betalent.tech',
        password: 'password123',
        role: 'USER',
      },
    ])
  }
}
