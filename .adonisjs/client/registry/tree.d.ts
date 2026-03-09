/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
  }
  transactions: {
    purchase: typeof routes['transactions.purchase']
    index: typeof routes['transactions.index']
    show: typeof routes['transactions.show']
    refund: typeof routes['transactions.refund']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  clients: {
    index: typeof routes['clients.index']
    show: typeof routes['clients.show']
  }
  gateways: {
    index: typeof routes['gateways.index']
    toggle: typeof routes['gateways.toggle']
    updatePriority: typeof routes['gateways.update_priority']
  }
}
