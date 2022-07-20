'use strict'

const Env = use('Env')
const ShoppingCart = use('App/Models/ShoppingCart')
const {
  getCurrentCustomer , 
  getChildCustomerTree , 
  showTreeChildrenCustomer
} = use('App/Libraries/TraitsHelpers')

const Package = use('App/Models/Package')
const Combo   = use('App/Models/Combo')
class ShoppingCartController {

/**
   * @swagger
   * /api/v1/cart/list:
   *   get:
   *     tags:
   *       - FE_ShoppingCart
   *     security:
   *       - Bearer: []
   *     summary: Wallet deposit
   *     description: "ShoppingCart List"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
    async list ({request, response }) {
        var data = request.all()
        const customer = await getCurrentCustomer(request.header('Authorization'))
        const listShoppingCart = await ShoppingCart.query().where('customer_id',customer.id).orderBy('id','DESC').fetch()
        const dataJSON = listShoppingCart.toJSON()
        var dataJsonResults = []
        for (var i = 0; i < dataJSON.length; i++) {
          var value = dataJSON[i]
          if(value.type == 'package'){
            const product = await Package.find(value.product_id)
            var price_buy = product.price
            if(product.price > product.price_sale && product.price_sale > 0){
              price_buy = product.price_sale
            }
            const pk      = await ShoppingCart.find(value.id)
            pk.price      = price_buy
            pk.total      = price_buy * value.quantity
            pk.save()
            /* SET VALUE */
            value.price = price_buy
            value.total = price_buy * value.quantity
          }else{
            const combo = await Combo.find(value.product_id)
            const pk    = await ShoppingCart.find(value.id)
            pk.price    = combo.price
            pk.total    = combo.price * value.quantity
            pk.save()
            /* SET VALUE */
            value.price = combo.price
            value.total = combo.price * value.quantity
          }
          dataJsonResults.push(value)
        }
        return response.respondWithSuccess(dataJsonResults, "List Cart Successful!")
    }
/**
   * @swagger
   * /api/v1/cart/create:
   *   post:
   *     tags:
   *       - FE_ShoppingCart
   *     summary: ShoppingCart List
   *     security:
   *       - Bearer: []
   *     description: ShoppingCart List
   *     parameters:
   *       - name: data
   *         description: ShoppingCart List
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/AddtoCartCustomer'
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
    async create ({request, response }) {
        var data = request.all()
        const customer = await getCurrentCustomer(request.header('Authorization'))
        const shopping_cart = new ShoppingCart()
        shopping_cart.os_device       = data.os_device
        shopping_cart.product_id      = data.product_id
        shopping_cart.ip_address      = data.ip_address
        shopping_cart.price           = data.price
        shopping_cart.quantity        = data.quantity
        shopping_cart.total           = data.total
        shopping_cart.customer_id     = customer.id
        shopping_cart.type            = data.type
        shopping_cart.last_name       = data.last_name
        shopping_cart.first_name      = data.first_name
        shopping_cart.phone_number    = data.phone_number
        shopping_cart.email           = data.email
        shopping_cart.gender          = data.gender
        shopping_cart.address         = data.address
        shopping_cart.province        = customer.province
        shopping_cart.country         = data.country
        shopping_cart.birthday        = data.birthday
        shopping_cart.company         = data.company
        shopping_cart.name            = data.name
        await shopping_cart.save()
        return response.respondWithSuccess(shopping_cart, 'Create New Bank Account Successful!')
    }

    /**
     * @swagger
     * /api/v1/cart/update:
     *   post:
     *     tags:
     *       - FE_ShoppingCart
     *     summary: ShoppingCart Create
     *     description: ShoppingCart Create
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - name: data
     *         description: ShoppingCart Create
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/UpdateCartCustomer'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async update ({request, response }) {
        var data = request.all()
        const customer = await getCurrentCustomer(request.header('Authorization'))
        const shopping_cart = await ShoppingCart.find(data.id)
        if (!shopping_cart) {
          return response.respondWithError([],'Cant not found ID bank!')
        }
        shopping_cart.os_device       = data.os_device
        shopping_cart.product_id      = data.product_id
        shopping_cart.ip_address      = data.ip_address
        shopping_cart.price           = data.price
        shopping_cart.quantity        = data.quantity
        shopping_cart.total           = data.total
        shopping_cart.customer_id     = customer.id
        shopping_cart.type            = data.type
        shopping_cart.last_name       = data.last_name
        shopping_cart.first_name      = data.first_name
        shopping_cart.phone_number    = data.phone_number
        shopping_cart.email           = data.email
        shopping_cart.gender          = data.gender
        shopping_cart.address         = data.address
        shopping_cart.province        = data.province
        shopping_cart.country         = data.country
        shopping_cart.birthday        = data.birthday
        shopping_cart.company         = data.company
        shopping_cart.name            = data.name
        await shopping_cart.save()
        return response.respondWithSuccess(shopping_cart,'Update Bank Account Successful!')
    }

    /**
     * @swagger
     * /api/v1/cart/delete:
     *   get:
     *     tags:
     *       - FE_ShoppingCart
     *     security:
     *       - Bearer: []
     *     summary: ShoppingCart Delete
     *     description: ShoppingCart Delete
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: ID
     *         in: query
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async delete ({request, response }) {
        var data = request.all()
        const customer = await getCurrentCustomer(request.header('Authorization'))
        const shopping_cart = await ShoppingCart.find(data.id)
        if (!shopping_cart) {
          return response.respondWithError(data,'Cant not found ID bank!')
        }
        shopping_cart.delete()
        return response.respondWithSuccess([],'Delete bank Successful!')
    }

    
}
module.exports = ShoppingCartController
