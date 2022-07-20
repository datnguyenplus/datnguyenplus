'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  	Route.post('/login','@provider:Frontend/AuthController.login')
  	Route.post('/signup','@provider:Frontend/AuthController.signup')
  	Route.post('/forgot-password','@provider:Frontend/AuthController.forgot')
  	Route.post('/new-password','@provider:Frontend/AuthController.confirmForgot')
  	Route.post('/active-account','@provider:Frontend/AuthController.activeAccount')
  	Route.get('/logout','@provider:Frontend/AuthController.logout').middleware(['authApi'])
  	Route.get('/user-profile','@provider:Frontend/AuthController.userProfile').middleware(['authApi'])
})
.prefix('api/v1')
/* my profile */
Route.group(() => {
	/* info setting user */
	Route.post('/update-profile','@provider:Frontend/ProfileController.updateProfile')
	Route.post('/two-factor-auth','@provider:Frontend/ProfileController.twoFactorAuth')
	Route.post('/change-password','@provider:Frontend/ProfileController.changePassword')
	Route.post('/invite-friend','@provider:Frontend/ProfileController.inviteFriend')
	/* Wallet User */
	Route.get('/wallet-info','@provider:Frontend/WalletController.index')
	Route.post('/wallet-withdraw','@provider:Frontend/WalletController.withdraw')
	Route.post('/wallet-deposit','@provider:Frontend/WalletController.deposit')

	/* Order User */
  Route.get('/list-combo','@provider:Frontend/OrderController.listCombo')
  Route.get('/list-package','@provider:Frontend/OrderController.listPackage')
	Route.post('/payment-order','@provider:Frontend/OrderController.paymentOrder')
	Route.get('/list-package-bought','@provider:Frontend/OrderController.listPackageBought')
  Route.get('/order-detail','@provider:Frontend/OrderController.reportViewDetail')
  Route.get('/list-order-latest','@provider:Frontend/OrderController.listOrderLatest')
  Route.get('/update-payment-view','@provider:Frontend/OrderController.updatePaymentView')
  /*Check promotion code */
  Route.post('/check-promotion-code','@provider:Frontend/OrderController.checkPromotionCode')

	/* Ref user child */
	Route.get('/ref-info-user','@provider:Frontend/ProfileController.refInfoUser')

  Route.get('/commissions','@provider:Frontend/OrderController.commissionsReportForUser')

  /* request withdraw user */
  Route.post('/request-withdraw','@provider:Frontend/WithdrawController.requestWithdraw')
  Route.get('/list-withdraw','@provider:Frontend/WithdrawController.listWithdraw')

  Route.get('/get-list-levels','@provider:Frontend/LevelController.getListLevels')
  Route.get('/get-level','@provider:Frontend/LevelController.getLevel')
})
.middleware(['authApi'])
.prefix('api/v1')

/* bank account */
Route.group(() => {
  Route.get('/list','@provider:Frontend/BankAccountController.list')
  Route.post('/create','@provider:Frontend/BankAccountController.create')
  Route.post('/update','@provider:Frontend/BankAccountController.update')
  Route.get('/delete','@provider:Frontend/BankAccountController.delete')
})
.middleware(['authApi'])
.prefix('api/v1/bank')

/* bank account */
Route.group(() => {
  Route.get('/info','@provider:Frontend/DashboardController.index')
})
.middleware(['authApi'])
.prefix('api/v1/dashboard')

/* bank account */
Route.group(() => {
  Route.get('/list','@provider:Frontend/DashboardController.getAllNews')
  Route.get('/detail','@provider:Frontend/DashboardController.getDetailNews')
})
.middleware(['authApi'])
.prefix('api/v1/news')
/* bank account */

Route.group(() => {
  Route.get('/list','@provider:Frontend/ShoppingCartController.list')
  Route.post('/create','@provider:Frontend/ShoppingCartController.create')
  Route.post('/update','@provider:Frontend/ShoppingCartController.update')
  Route.get('/delete','@provider:Frontend/ShoppingCartController.delete')
})
.middleware(['authApi'])
.prefix('api/v1/cart')

Route.group(() => {
  	Route.get('/countries','@provider:Frontend/CountryController.countries')
  	Route.get('/cities','@provider:Frontend/CountryController.cities')
    Route.post('/alepay-hook','@provider:Frontend/OrderController.alepayHook')
})
.prefix('api/v1')

