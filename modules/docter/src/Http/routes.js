'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.group(() => {

  Route.get('/list','@provider:Product/ProductController.getList')
  	.middleware(['permission:salePackageView'])

  Route.post('/create','@provider:Product/ProductController.postCreateProduct')
  	.middleware(['permission:salePackageCreate'])

  Route.get('/edit','@provider:Product/ProductController.findProduct')
  	.middleware(['permission:salePackageUpdate'])

  Route.put('/update','@provider:Product/ProductController.update')
  	.middleware(['permission:salePackageUpdate'])

  Route.delete('/delete','@provider:Product/ProductController.delete')
  	.middleware(['permission:salePackageDelete'])
})
.middleware(['adminAuthApi'])
.prefix('api/v1/product')