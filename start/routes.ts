/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import GruposController from '#controllers/grupos_controller'
import MembrosController from '#controllers/membros_controller'
import DespesasController from '#controllers/despesas_controller'
import PagamentosController from '#controllers/pagamentos_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/teste/auth', async () => {
  return {
    hello: 'world com Auth kk',
  }
}).use(middleware.auth())

router.group(() => {
  router.post('/registrar', [AuthController, 'registro'])
  router.post('/login', [AuthController, 'login'])
}).prefix('usuarios')

router.resource('grupos', GruposController).apiOnly().use('*', middleware.auth())

router.group(() => {
  router.post(':id/membros', [MembrosController, 'adicionarMembro'])
  router.get(':id/membros', [MembrosController, 'listarMembros'])
  router.delete(':id/membros', [MembrosController, 'removerMembro'])
  router.get('/:id/dashboards', [DespesasController, 'dashboard'])
}).prefix('grupos').use(middleware.auth())

router.post('/despesas', [DespesasController, 'store']).use(middleware.auth())
router.put('/despesas/:id', [DespesasController, 'update']).use(middleware.auth())
router.delete('/despesas/:id', [DespesasController, 'destroy']).use(middleware.auth())

router.post('/pagamentos', [PagamentosController, 'store']).use(middleware.auth())
