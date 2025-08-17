import vine from '@vinejs/vine'

export const validadorCriarDespesa = vine.compile(
  vine.object({
    grupoId: vine.number().positive(),
    valor: vine.number().positive().decimal([0, 2]),
    data: vine.date({ formats: ['DD/MM/YYYY'] }),
    descricao: vine.string().minLength(3).maxLength(255),
    pagadorId: vine.number().positive(),
    tipoDivisao: vine.enum(['igualmente', 'porcentagem', 'valor']),
    participantes: vine.array(
      vine.object({
        id: vine.number().positive(),
        valor: vine.number().positive().decimal([0, 2]).optional()
      })
    ).minLength(1),
    categoria: vine.string().minLength(3).maxLength(100)
  })
)
