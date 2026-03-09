import vine from '@vinejs/vine'

export const updatePriorityValidator = vine.create({
  priority: vine.number().min(1),
})
