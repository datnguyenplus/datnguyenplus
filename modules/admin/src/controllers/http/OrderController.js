'use strict'

const Env = use('Env')
const Mail = use('Mail')
const path = require('path')
const Order = use('App/Models/Order')
const OrderDetail = use('App/Models/OrderDetail')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
const Helpers = use('Helpers')
const HelperLibraries = use('App/Libraries/Helpers')
const Customer = use('App/Models/Customer')
const {showLevelTypeFCustomer} = use('App/Libraries/TraitsHelpers')
const Package = use('App/Models/Package')
const ConfigCommissions = use('App/Models/ConfigCommissions')
const Commission = use('App/Models/Commission')
const Transaction = use('App/Models/Transaction')
class OrderController {
	/**
  	* @swagger
  	* /api/v1/admin/order/list:
  	*   get:
  	*     tags:
  	*       - AdminOrder
  	*     summary: List Order
  	*     security:
  	*       - Bearer: []
  	*     responses:
  	*       200:
  	*         description: Server OK!
  	*/
  	async list ({request, response }) {
        var data = request.all()
        const orders = await Order.query().with('customer').fetch()
        return response.respondWithSuccess(orders , 'List Orders Successful!')
  	}

    /**
    * @swagger
    * /api/v1/admin/order/create:
    *   post:
    *     tags:
    *       - AdminOrder
    *     summary: List Order
    *     security:
    *       - Bearer: []
    *     parameters:
    *       - name: info
    *         description: 'Create Order'
    *         in:  body
    *         required: true
    *         type: string
    *         schema:
    *           $ref: '#/definitions/CreateOrder'
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async create ({request, response }) {
        var data = request.all()
         /* ------- start insert order by admin --------*/
        const order = new Order()
        order.status = data.status
        order.order_code = 'ICB'
        order.customer_id = data.customer_id
        order.quantity = data.quantity
        order.promotion_code = data.promotion_code
        order.promotion_value = data.promotion_value
        order.total_pay = data.total_pay
        order.node = data.node
        order.payment_type = data.payment_type
        order.payment_view = 0
        await order.save()
        var str = "" + order.id
        var converId = "00000"
        order.order_code = order.order_code + converId.substring(0, converId.length - str.length) + str
        order.node = data.node
        order.save()

        /* Insert order detail Can for loop Items if > 1 item */
        var formDataOrderDetails = data.order_details
        for(var i in formDataOrderDetails) {
            var val = formDataOrderDetails[i]
            const orderDetail          = new OrderDetail()
            orderDetail.order_id        = order.id
            orderDetail.product_id      = val.product_id
            orderDetail.quantity        = val.quantity
            orderDetail.price           = val.price
            orderDetail.total           = val.total
            orderDetail.note            = val.note
            orderDetail.last_name       = val.last_name
            orderDetail.first_name      = val.first_name
            orderDetail.phone_number    = val.phone_number
            orderDetail.email           = val.email
            orderDetail.gender          = val.gender
            orderDetail.address         = val.address
            orderDetail.province        = val.province
            orderDetail.country         = val.country
            orderDetail.birthday        = val.birthday
            orderDetail.company         = val.company
            orderDetail.type            = val.type
            orderDetail.name            = val.name
            await orderDetail.save()
        }
        var customer = await Customer.query().where('id',data.customer_id).first()
        /* SEND MAIL */
        let constTemplateId = use('TemplateId').TEMPLATE_ORDER_NEW;
        const ModelSendGird = await use('ModelSendGird').findSlugTemplate(constTemplateId);
        var userData = {
          toEmail : customer.email,
          templateId : ModelSendGird.template_id,
          drawData : {
            full_name  : customer.getFullNameAttribute, //user.getFullNameAttribute(),
            orderCode : order.order_code,
            orderValue : order.total_pay,
          }
        }
        const  sendGird = await use('SendGird').sendMail(userData)

        /* end commistions for customers */
        var dataOrderDetails = await Order.query().with('customer').with('detailOrders').where('id',order.id).first()
        return response.respondWithSuccess(dataOrderDetails , 'Create Orders Successful!')
    }
    /**
    * @swagger
    * /api/v1/admin/order/edit:
    *   get:
    *     tags:
    *       - AdminOrder
    *     summary: List Order
    *     security:
    *       - Bearer: []
    *     parameters:
    *       - name: id
    *         description: Edit Order
    *         in: query
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async edit ({request, response }) {
        var data = request.all()
        const order = await Order.query().with('detailOrders').where('id',data.id).first()
        if (!order) {
              return response.respondWithError('Not found id order!')
        }
        return response.respondWithSuccess(order , 'Get Id order Successful!')
    }

    /**
    * @swagger
    * /api/v1/admin/order/update:
    *   post:
    *     tags:
    *       - AdminOrder
    *     summary: List Order
    *     security:
    *       - Bearer: []
    *     parameters:
    *       - name: info
    *         description: Create Order
    *         in:  body
    *         required: true
    *         type: string
    *         schema:
    *           $ref: '#/definitions/UpdateOrder'
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async update ({request, response }) {
        var data = request.all()
         /* ------- start insert order by admin --------*/
        const order = await Order.find(data.id)
        if (!order) {
            return response.respondWithError('Not found Id order!')
        }
        await OrderDetail.query().where('order_id',order.id).delete()
        order.status = data.status
        order.customer_id = data.customer_id
        order.quantity = data.quantity
        order.promotion_code = data.promotion_code
        order.promotion_value = data.promotion_value
        order.total_pay = data.total_pay
        order.node = data.node
        order.payment_type = data.payment_type
        order.payment_view = 0
        await order.save()
        /* Insert order detail Can for loop Items if > 1 item */
        var formDataOrderDetails = data.order_details
        for(var i in formDataOrderDetails) {
            var val = formDataOrderDetails[i]
            const orderDetail          = new OrderDetail()
            orderDetail.order_id        = order.id
            orderDetail.product_id      = val.product_id
            orderDetail.quantity        = val.quantity
            orderDetail.price           = val.price
            orderDetail.total           = val.total
            orderDetail.note            = val.note
            orderDetail.last_name       = val.last_name
            orderDetail.first_name      = val.first_name
            orderDetail.phone_number    = val.phone_number
            orderDetail.email           = val.email
            orderDetail.gender          = val.gender
            orderDetail.address         = val.address
            orderDetail.province        = val.province
            orderDetail.country         = val.country
            orderDetail.birthday        = val.birthday
            orderDetail.company         = val.company
            orderDetail.type            = val.type
            orderDetail.name            = val.name
            await orderDetail.save()
        }
        /* end commistions for customers */
        var dataOrderDetails = await Order.query().with('customer').with('detailOrders').where('id',order.id).first()
        return response.respondWithSuccess(dataOrderDetails , 'Update Orders Successful!')
    }
    /**
    * @swagger
    * /api/v1/admin/order/change:
    *   post:
    *     tags:
    *       - AdminOrder
    *     summary: Change status Order
    *     parameters:
    *       - name: id
    *         description: Edit Order
    *         in: query
    *         required: true
    *         type: string

    *       - name: status
    *         description: status
    *         in: query
    *         required: true
    *         type: string
    *     security:
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async change ({request, response }) {
        var data = request.all()
         /* ------- start insert order by admin --------*/
        const order = await Order.find(data.id)
        if (!order) {
            return response.respondWithError('Not found Id order!')
        }
        order.status = data.status
        order.save()
        const orderData = await Order.query().with('detailOrders').where('id',order.id).first()
        return response.respondWithSuccess(orderData , 'Change Orders Successful!')
    }
    /**
    * @swagger
    * /api/v1/admin/order/delete:
    *   get:
    *     tags:
    *       - AdminOrder
    *     summary: Delete status Order
    *     parameters:
    *       - name: id
    *         description: Delete Order
    *         in: query
    *         required: true
    *         type: string
    *     security:
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async delete ({request, response }) {
        var data = request.all()
         /* ------- start insert order by admin --------*/
        const order = await Order.find(data.id)
        if (!order) {
            return response.respondWithError('Not found Id order!')
        }
        order.delete()
        /* Delete order detail */
        const orderDetails = await OrderDetail.query().where('order_id',data.id).delete()
        /* Delete Transaction */
        const transactions = await Transaction.query().where('order_id',data.id).delete()
        /* Delete Commssiosions*/
        const commissions = await Commission.query().where('order_id',data.id).delete()
        return response.respondWithSuccess([] , 'Delete Order Successful!')
    }

    /**
    * @swagger
    * /api/v1/admin/order/detail:
    *   get:
    *     tags:
    *       - AdminOrder
    *     summary:  Report
    *     security:
    *       - Bearer: []
    *     parameters:
    *       - name: id
    *         description: Detail Order
    *         in: query
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async showDetail ({request, response }) {
        var data = request.all()
        const order = await Order.query().with('customer').with('detailOrders').where('id',data.id).first()
        if (!order) {
              return response.respondWithError('Not found id order!')
        }
        return response.respondWithSuccess(order , 'Get Order Detail Successful!')
    }
}
module.exports = OrderController
