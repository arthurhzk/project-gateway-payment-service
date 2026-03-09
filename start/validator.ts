import { DateTime } from 'luxon'
import vine, { VineDate, SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  required: 'O campo {{ field }} é obrigatório',
  string: 'O valor do campo {{ field }} deve ser uma string',
  email: 'O valor não é um endereço de email válido',
  minLength: 'O campo {{ field }} deve ter no mínimo {{ min }} caracteres',
  maxLength: 'O campo {{ field }} deve ter no máximo {{ max }} caracteres',
  fixedLength: 'O campo {{ field }} deve ter exatamente {{ size }} caracteres',
  regex: 'O formato do campo {{ field }} é inválido',
  number: 'O valor do campo {{ field }} deve ser um número',
  positive: 'O campo {{ field }} deve ser um número positivo',
  min: 'O campo {{ field }} deve ser no mínimo {{ min }}',
  unique: 'O valor do campo {{ field }} já está em uso',
  enum: 'O valor do campo {{ field }} é inválido',
  array: 'O campo {{ field }} deve ser um array',
}, {
  name: 'nome',
  email: 'email',
  password: 'senha',
  role: 'função',
  clientName: 'nome do cliente',
  clientEmail: 'email do cliente',
  cardNumber: 'número do cartão',
  cvv: 'CVV',
  products: 'produtos',
  amount: 'valor',
  priority: 'prioridade',
})

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))
