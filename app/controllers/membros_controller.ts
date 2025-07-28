import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario';
import Grupo from '#models/grupo';

export default class MembrosController {
    async adicionarMembro({ params, auth }: HttpContext) {
        const usuario = await Usuario.findBy('id', auth.user!.id)
        if (!usuario) {
            return {
                sucesso: false,
                mensagem: 'Usuário não encontrado'
            }
        }

        const grupo = await Grupo.findBy('id', params.id)
        if (!grupo) {
            return {
                sucesso: false,
                mensagem: 'Grupo não encontrado'
            }
        }

        const jaEhMembro = await usuario.related('grupos').query().where('grupos.id', params.id).first()
        if (jaEhMembro) {
            return {
                sucesso: false,
                mensagem: 'Você já é membro deste grupo'
            }
        }

        await usuario.related('grupos').attach([grupo.id])

        return {
            sucesso: true,
            mensagem: `Você foi adicionado ao grupo ${grupo.nome} com sucesso!`
        }
    }

    // Listar membros de um grupo
    async listarMembros({ params, auth }: HttpContext) {
        const usuario = await Usuario.findBy('id', auth.user!.id)
        if (!usuario) {
            return {
                sucesso: false,
                mensagem: 'Usuário não encontrado'
            }
        }

        // Verifica se o usuário é membro do grupo
        const grupo = await usuario.related('grupos').query().where('grupos.id', params.id).first()
        if (!grupo) {
            return {
                sucesso: false,
                mensagem: 'Grupo não encontrado ou você não é membro deste grupo'
            }
        }

        // Carrega todos os membros do grupo
        await grupo.load('grupos')

        return {
            sucesso: true,
            membros: grupo.grupos.map(membro => ({
                id: membro.id,
                nome: membro.nome
            }))
        }
    }

    async removerMembro({ params, request, auth }: HttpContext) {
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
                mensagem: 'Grupo não encontrado ou você não é membro deste grupo'
            }
        }

        const { usuarioId } = request.only(['usuarioId'])
        
        const membroPraRemover = await Usuario.findBy('id', usuarioId)
        if (!membroPraRemover) {
            return {
                sucesso: false,
                mensagem: 'Usuário a ser removido não encontrado'
            }
        }

        const membroNoGrupo = await membroPraRemover.related('grupos').query().where('grupos.id', params.id).first()
        if (!membroNoGrupo) {
            return {
                sucesso: false,
                mensagem: 'Usuário não é membro deste grupo'
            }
        }

        await membroPraRemover.related('grupos').detach([grupo.id])

        return {
            sucesso: true,
            mensagem: `${membroPraRemover.nome} foi removido do grupo ${grupo.nome} com sucesso!`
        }
    }
}