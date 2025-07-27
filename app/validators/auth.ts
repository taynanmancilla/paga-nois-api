import vine from '@vinejs/vine'

export const validadorRegistro = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail().unique(async (bd, valor) => {
      const user = await bd.from('usuarios')
        .select('id')
        .where('email', valor)
        .first()
      
      return !user;
    }),
    senha: vine.string().minLength(8),
    nome: vine.string().maxLength(255)
  })
)

export const validadorLogin = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    senha: vine.string().minLength(8)
  })
)