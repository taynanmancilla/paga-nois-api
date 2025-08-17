import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'O campo {{field}} é obrigatório',
  'string': 'O valor do campo {{field}} deve ser uma string',
  'email': 'O endereço de email digitado não é valido',
  'alphaNumeric': 'Apenas letras e números no nome do seu grupo',
  'maxLength': 'O campo {{field}} é muito grande',
  'database.unique': 'Esse {{field}} ja esta em uso',

  'username.required': 'Escolha um nome de usuário para sua conta',
})
