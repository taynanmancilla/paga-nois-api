import Usuario from '#models/usuario'
import { validadorLogin, validadorRegistro } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  
  async registro({ request }: HttpContext) {
    const dados = await request.validateUsing(validadorRegistro)

    const usuario = await Usuario.create(dados)

    return Usuario.accessTokens.create(usuario)
  }
  
  async login({ request }: HttpContext) {
    const { email, senha } = await request.validateUsing(validadorLogin)

    const usuario = await Usuario.verifyCredentials(email, senha)

    return await Usuario.accessTokens.create(usuario)
  }
  
  // async logout({}: HttpContext) {} -- IMPLEMENTAR DEPOIS

}