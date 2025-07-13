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
