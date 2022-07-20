'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/login','AuthController.index')
})
.prefix('auth')
.namespace('Admin')

Route.group(() => {
	Route.post('/eth-transferGas','UserController.transferGas')
  	Route.post('/eth-transfer','UserController.transfer')
  	Route.post('/eth-create','UserController.createWallet')
  	Route.get('/eth-balance','UserController.balance')
  	Route.get('/eth-hash','UserController.hash')
  	Route.get('/eth-transactions','UserController.transactions')
  	Route.get('/eth-block','UserController.block')
})
.prefix('api')
.namespace('Admin')


Route.get('/', ({ response }) => {
  response.redirect('/docs')
})
