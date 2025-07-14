import Usuario from '#models/usuario';
import { validadorCriarGrupo } from '#validators/grupo';
import type { HttpContext } from '@adonisjs/core/http'

export default class GruposController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  async store({ request, auth }: HttpContext) {
    const data = await request.validateUsing(validadorCriarGrupo, {
      meta: {
        usuarioId: auth.user!.id
      }
    })

    const usuario = await Usuario.findBy('id', auth.user!.id)

    const grupo = await usuario?.related('grupos').create({
      nome: data.nome
    })

    if (grupo) {
      return {
        sucesso: true,
        mensagem: `Grupo "${grupo.nome}" criado com sucesso!`,
        grupoId: grupo.id
      }
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}