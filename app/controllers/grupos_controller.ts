import Usuario from '#models/usuario';
import Grupo from '#models/grupo';
import { validadorCriarGrupo, validadorAtualizarGrupo } from '#validators/grupo';
import type { HttpContext } from '@adonisjs/core/http'

export default class GruposController {
  async index({ auth }: HttpContext) {
    const usuario = await Usuario.findBy('id', auth.user!.id);
    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      };
    }
    const grupos = await usuario.related('grupos').query()

    return {
      sucesso: true,
      grupos: grupos.map(grupo => ({
        id: grupo.id,
        nome: grupo.nome
      }))
    }
  }

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
        mensagem: `Grupo ${grupo.nome} criado com sucesso!`,
        grupoId: grupo.id
      }
    }
  }

  async update({ params, request, auth }: HttpContext) {
    const grupo = await Grupo.findBy('id', params.id)
    if (!grupo) {
      return {
        sucesso: false,
        mensagem: 'Grupo não encontrado'
      }
    }
    const data = await request.validateUsing(validadorAtualizarGrupo, {
      meta: {
        usuarioId: auth.user?.id
      }
    })
    
    grupo.merge(data)
    await grupo.save()

    return {
      sucesso: true,
      mensagem: `Grupo ${grupo.nome} atualizado com sucesso!`,
      grupoId: grupo.id
    }
  }

  async destroy({ params, auth }: HttpContext) {
    const usuario = await Usuario.findBy('id', auth.user!.id)
    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      }
    }

    const grupo = await usuario.related('grupos').query().where('grupos.id', params.id).first()
    if (!grupo) {
      return {
        sucesso: false,
        mensagem: 'Grupo não encontrado'
      }
    }

    await usuario.related('grupos').detach([grupo.id])
    
    await grupo.delete()

    return {
      sucesso: true,
      mensagem: `Grupo ${grupo.nome} deletado com sucesso!`
    }
  }
}