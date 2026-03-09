import vine from '@vinejs/vine'

export const purchaseValidator = vine.create({
  clientName: vine.string().minLength(2).maxLength(100),
  clientEmail: vine.string().email().maxLength(254),
  cardNumber: vine.string().fixedLength(16).regex(/^\d+$/),
  cvv: vine.string().minLength(3).maxLength(4).regex(/^\d+$/),
  products: vine
    .array(
      vine.object({
        id: vine.number().positive(),
        quantity: vine.number().positive().min(1),
      })
    )
    .minLength(1),
})
