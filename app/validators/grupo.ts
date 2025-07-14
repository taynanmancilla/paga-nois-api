import vine from '@vinejs/vine'

const nome = vine.string().maxLength(255).unique(async (bd, valor, field) => {
  const grupo = await bd.from('grupos')
    .join('grupo_usuario', 'grupos.id', 'grupo_usuario.grupo_id')
    .where('grupos.nome', valor)
    .where('grupo_usuario.usuario_id', field.meta.usuarioId)
    .first()
  
  return !grupo;
})

export const validadorCriarGrupo = vine.compile(
  vine.object({
    nome
  })
)


export const validadorAtualizarGrupo = vine.compile(
  vine.object({
    nome
  })
)
