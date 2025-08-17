import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Despesa from '#models/despesa'
import DespesaUsuario from '#models/despesa_usuario'
import Pagamento from '#models/pagamento'
import { validadorCriarDespesa } from '#validators/despesa'
import { DateTime } from 'luxon'

export default class DespesasController {
  async store({ request, auth }: HttpContext) {
    const data = await request.validateUsing(validadorCriarDespesa)
    
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

    const pagador = await Usuario.findBy('id', data.pagadorId)
    if (!pagador) {
      return {
        sucesso: false,
        mensagem: 'Pagador não encontrado'
      }
    }

    const pagadorNoGrupo = await pagador.related('grupos').query()
      .where('grupos.id', data.grupoId).first()
    if (!pagadorNoGrupo) {
      return {
        sucesso: false,
        mensagem: 'Pagador não é membro do grupo'
      }
    }

    const participantesIds = data.participantes.map(p => p.id)
    const participantesNoGrupo = await Usuario.query()
      .whereIn('id', participantesIds)
      .whereHas('grupos', (query) => {
        query.where('grupos.id', data.grupoId)
      })

    if (participantesNoGrupo.length !== participantesIds.length) {
      return {
        sucesso: false,
        mensagem: 'Alguns participantes não são membros do grupo'
      }
    }

    const valoresCalculados = this.calcularValores(data)
    
    if (!valoresCalculados.sucesso) {
      return valoresCalculados
    }

    const despesa = await Despesa.create({
      agiotaId: data.pagadorId,
      grupoId: data.grupoId,
      valor: data.valor,
      descricao: data.descricao,
      tipoDivisao: data.tipoDivisao,
      categoria: data.categoria,
      data: DateTime.fromJSDate(data.data)
    })

    for (const participante of valoresCalculados.participantes!) {
      await DespesaUsuario.create({
        despesaId: despesa.id,
        usuarioId: participante.id,
        valorDevido: participante.valorDevido,
        pago: false
      })
    }

    return {
      sucesso: true,
      mensagem: 'Despesa criada com sucesso!',
      despesaId: despesa.id
    }
  }

  async update({ params, request, auth }: HttpContext) {
    const data = await request.validateUsing(validadorCriarDespesa)
    
    const usuarioLogado = await Usuario.findBy('id', auth.user!.id)
    if (!usuarioLogado) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      }
    }

    const despesa = await Despesa.findBy('id', params.id)
    if (!despesa) {
      return {
        sucesso: false,
        mensagem: 'Despesa não encontrada'
      }
    }

    const grupoAtual = await usuarioLogado.related('grupos').query()
      .where('grupos.id', despesa.grupoId).first()
    if (!grupoAtual) {
      return {
        sucesso: false,
        mensagem: 'Você não tem permissão para editar esta despesa'
      }
    }

    if (data.grupoId !== despesa.grupoId) {
      const novoGrupo = await usuarioLogado.related('grupos').query()
        .where('grupos.id', data.grupoId).first()
      if (!novoGrupo) {
        return {
          sucesso: false,
          mensagem: 'Novo grupo não encontrado ou você não é membro dele'
        }
      }
    }

    const pagador = await Usuario.findBy('id', data.pagadorId)
    if (!pagador) {
      return {
        sucesso: false,
        mensagem: 'Pagador não encontrado'
      }
    }

    const pagadorNoGrupo = await pagador.related('grupos').query()
      .where('grupos.id', data.grupoId).first()
    if (!pagadorNoGrupo) {
      return {
        sucesso: false,
        mensagem: 'Pagador não é membro do grupo'
      }
    }

    const participantesIds = data.participantes.map(p => p.id)
    const participantesNoGrupo = await Usuario.query()
      .whereIn('id', participantesIds)
      .whereHas('grupos', (query) => {
        query.where('grupos.id', data.grupoId)
      })

    if (participantesNoGrupo.length !== participantesIds.length) {
      return {
        sucesso: false,
        mensagem: 'Alguns participantes não são membros do grupo'
      }
    }

    const valoresCalculados = this.calcularValores(data)
    
    if (!valoresCalculados.sucesso) {
      return valoresCalculados
    }

    despesa.merge({
      agiotaId: data.pagadorId,
      grupoId: data.grupoId,
      valor: data.valor,
      descricao: data.descricao,
      tipoDivisao: data.tipoDivisao,
      categoria: data.categoria,
      data: DateTime.fromJSDate(data.data)
    })

    await despesa.save()

    await DespesaUsuario.query().where('despesa_id', despesa.id).delete()

    for (const participante of valoresCalculados.participantes!) {
      await DespesaUsuario.create({
        despesaId: despesa.id,
        usuarioId: participante.id,
        valorDevido: participante.valorDevido,
        pago: false
      })
    }

    const resumo = valoresCalculados.participantes!.map((p: any) => ({
      usuarioId: p.id,
      valor: p.valorDevido
    }))

    return {
      sucesso: true,
      mensagem: 'Despesa editada com sucesso',
      resumo
    }
  }

  async destroy({ params, auth }: HttpContext) {
    const usuarioLogado = await Usuario.findBy('id', auth.user!.id)
    if (!usuarioLogado) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      }
    }

    const despesa = await Despesa.findBy('id', params.id)
    if (!despesa) {
      return {
        sucesso: false,
        mensagem: 'Despesa não encontrada'
      }
    }

    const grupo = await usuarioLogado.related('grupos').query()
      .where('grupos.id', despesa.grupoId).first()
    if (!grupo) {
      return {
        sucesso: false,
        mensagem: 'Você não tem permissão para remover esta despesa'
      }
    }

    await DespesaUsuario.query().where('despesa_id', despesa.id).delete()

    await despesa.delete()

    return {
      sucesso: true,
      mensagem: 'Despesa removida com sucesso!'
    }
  }

  async dashboard({ params, auth }: HttpContext) {
    const usuarioLogado = await Usuario.findBy('id', auth.user!.id)
    if (!usuarioLogado) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      }
    }

    const grupo = await usuarioLogado.related('grupos').query()
      .where('grupos.id', params.grupoId).first()
    if (!grupo) {
      return {
        sucesso: false,
        mensagem: 'Grupo não encontrado ou você não é membro deste grupo'
      }
    }

    const despesas = await Despesa.query()
      .where('grupo_id', params.grupoId)
      .preload('agiota')
      .preload('participantes', (query) => {
        query.preload('usuario')
      })
      .orderBy('data_cadastro', 'desc')

    const pagamentos = await Pagamento.query()
      .where('grupo_id', params.grupoId)
      .preload('pagador')
      .preload('recebedor')
      .orderBy('data_cadastro', 'desc')

    const transacoes = []

    for (const despesa of despesas) {
      const detalhes = despesa.participantes
        .filter(p => p.usuarioId !== despesa.agiotaId)
        .map(p => ({
          nome: p.usuario.nome,
          usuarioId: p.usuarioId,
          valor: p.valorDevido
        }))

      transacoes.push({
        descricao: `${despesa.agiota.nome} adicionou uma despesa de R$ ${despesa.valor.toFixed(2)}`,
        detalhes: detalhes.length > 0 ? detalhes : undefined
      })
    }

    for (const pagamento of pagamentos) {
      transacoes.push({
        descricao: `${pagamento.pagador.nome} pagou R$ ${pagamento.valor.toFixed(2)} para ${pagamento.recebedor.nome}`
      })
    }
    
    const membrosDoGrupo = await Usuario.query()
      .whereHas('grupos', (query) => {
        query.where('grupos.id', params.grupoId)
      })

    const saldos = []

    for (const membro of membrosDoGrupo) {
      let saldo = 0

      const despesasPagas = await Despesa.query()
        .where('grupo_id', params.grupoId)
        .where('agiota_id', membro.id)
        .sum('valor as total')
      
      saldo += Number(despesasPagas[0].$extras.total || 0)

      const valoresDevidos = await DespesaUsuario.query()
        .where('usuario_id', membro.id)
        .whereHas('despesa', (query) => {
          query.where('grupo_id', params.grupoId)
        })
        .sum('valor_devido as total')

      saldo -= Number(valoresDevidos[0].$extras.total || 0)

      const pagamentosRecebidos = await Pagamento.query()
        .where('grupo_id', params.grupoId)
        .where('recebedor_id', membro.id)
        .sum('valor as total')

      saldo += Number(pagamentosRecebidos[0].$extras.total || 0)

      const pagamentosFeitos = await Pagamento.query()
        .where('grupo_id', params.grupoId)
        .where('pagador_id', membro.id)
        .sum('valor as total')

      saldo -= Number(pagamentosFeitos[0].$extras.total || 0)

      saldos.push({
        nome: membro.nome,
        usuarioId: membro.id,
        saldo: Math.round(saldo * 100) / 100
      })
    }

    return {
      sucesso: true,
      grupo: {
        id: params.grupoId,
        transacoes,
        saldos
      }
    }
  }

  private calcularValores(data: any) {
    const { valor, tipoDivisao, participantes } = data
    const result: any = { sucesso: true, participantes: [] }

    switch (tipoDivisao) {
      case 'igualmente':
        const valorPorPessoa = valor / participantes.length
        result.participantes = participantes.map((p: any) => ({
          id: p.id,
          valorDevido: Math.round(valorPorPessoa * 100) / 100
        }))
        break

      case 'valor':
        const participantesComValor = participantes.filter((p: any) => p.valor !== undefined)
        const participantesSemValor = participantes.filter((p: any) => p.valor === undefined)

        if (participantesSemValor.length > 1) {
          return {
            sucesso: false,
            mensagem: 'No máximo um participante pode ficar sem valor especificado'
          }
        }

        const somaValoresEspecificados = participantesComValor.reduce((soma: number, p: any) => soma + p.valor, 0)
        
        if (participantesSemValor.length === 0) {
          if (Math.abs(somaValoresEspecificados - valor) > 0.01) {
            return {
              sucesso: false,
              mensagem: 'A soma dos valores dos participantes não confere com o valor total'
            }
          }
          result.participantes = participantes.map((p: any) => ({
            id: p.id,
            valorDevido: p.valor
          }))
        } else {
          const valorRestante = valor - somaValoresEspecificados
          if (valorRestante < 0) {
            return {
              sucesso: false,
              mensagem: 'A soma dos valores especificados excede o valor total'
            }
          }

          result.participantes = participantes.map((p: any) => ({
            id: p.id,
            valorDevido: p.valor !== undefined ? p.valor : valorRestante
          }))
        }
        break

      case 'porcentagem':
        const participantesComPorcentagem = participantes.filter((p: any) => p.valor !== undefined)
        const participantesSemPorcentagem = participantes.filter((p: any) => p.valor === undefined)

        if (participantesSemPorcentagem.length > 1) {
          return {
            sucesso: false,
            mensagem: 'No máximo um participante pode ficar sem porcentagem especificada'
          }
        }

        const somaPorcentagens = participantesComPorcentagem.reduce((soma: number, p: any) => soma + p.valor, 0)
        
        if (participantesSemPorcentagem.length === 0) {
          if (Math.abs(somaPorcentagens - 100) > 0.01) {
            return {
              sucesso: false,
              mensagem: 'A soma das porcentagens deve ser 100%'
            }
          }
          result.participantes = participantes.map((p: any) => ({
            id: p.id,
            valorDevido: Math.round((valor * p.valor / 100) * 100) / 100
          }))
        } else {
          const porcentagemRestante = 100 - somaPorcentagens
          if (porcentagemRestante < 0) {
            return {
              sucesso: false,
              mensagem: 'A soma das porcentagens excede 100%'
            }
          }

          result.participantes = participantes.map((p: any) => ({
            id: p.id,
            valorDevido: p.valor !== undefined 
              ? Math.round((valor * p.valor / 100) * 100) / 100
              : Math.round((valor * porcentagemRestante / 100) * 100) / 100
          }))
        }
        break
    }

    return result
  }
}