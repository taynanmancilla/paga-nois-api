import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Pagamento from '#models/pagamento'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

const validadorCriarPagamento = vine.compile(
  vine.object({
    grupoId: vine.number().positive(),
    recebedorId: vine.number().positive(),
    valor: vine.number().positive().decimal([0, 2]),
    data: vine.date({ formats: ['DD/MM/YYYY'] }),
    descricao: vine.string().maxLength(255).optional()
  })
)

export default class PagamentosController {
  async store({ request, auth }: HttpContext) {
    const data = await request.validateUsing(validadorCriarPagamento)
    
    const usuarioLogado = await Usuario.findBy('id', auth.user!.id)
    if (!usuarioLogado) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      }
    }

    const grupo = await usuarioLogado.related('grupos').query()
      .where('grupos.id', data.grupoId).first()
    if (!grupo) {
      return {
        sucesso: false,
        mensagem: 'Grupo não encontrado ou você não é membro deste grupo'
      }
    }

    const recebedor = await Usuario.findBy('id', data.recebedorId)
    if (!recebedor) {
      return {
        sucesso: false,
        mensagem: 'Recebedor não encontrado'
      }
    }

    const recebedorNoGrupo = await recebedor.related('grupos').query()
      .where('grupos.id', data.grupoId).first()
    if (!recebedorNoGrupo) {
      return {
        sucesso: false,
        mensagem: 'Recebedor não é membro do grupo'
      }
    }

    if (usuarioLogado.id === data.recebedorId) {
      return {
        sucesso: false,
        mensagem: 'Você não pode fazer um pagamento para si mesmo'
      }
    }

    const pagamento = await Pagamento.create({
      grupoId: data.grupoId,
      pagadorId: usuarioLogado.id,
      recebedorId: data.recebedorId,
      valor: data.valor,
      descricao: data.descricao || null,
      data: DateTime.fromJSDate(data.data)
    })

    return {
      sucesso: true,
      mensagem: 'Pagamento registrado com sucesso!',
      pagamentoId: pagamento.id
    }
  }
}