import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const createUserValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
})

export const updateUserValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100).optional(),
  email: email().optional(),
  password: password().optional(),
  role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
})
