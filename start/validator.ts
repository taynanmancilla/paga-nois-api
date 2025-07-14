import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'O campo {{field}} é obrigatório',
  'string': 'O valor do campo {{field}} deve ser uma string',
  'email': 'O endereço de email digitado não é valido',
  'alphaNumeric': 'Apenas letras e números no nome do seu grupo',
  'maxLength': 'O campo {{field}} é muito grande',
  'database.unique': 'Você ja possui um {{field}} com esse valor',

  // Error message for the username field
  'username.required': 'Escolha um nome de usuário para sua conta',
})
