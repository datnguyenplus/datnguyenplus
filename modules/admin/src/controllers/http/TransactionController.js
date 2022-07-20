'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Transaction = use('App/Models/Transaction')
const Database = use('Database')
const Hash = use('Hash')
const CurrencyExchange = use('App/Models/CurrencyExchange')

const {
  showLevelTypeFCustomer ,
  getCurrentCustomer
} = use('App/Libraries/TraitsHelpers')
const collect = require('collect.js')
const Customer = use('App/Models/Customer')
const ProductCommisions = use('App/Models/ProductCommisions')
const Commission = use('App/Models/Commission')
const OrderDetail = use('App/Models/OrderDetail')
const Order = use('App/Models/Order')
class TransactionController {


    /**
      * @swagger
      * /api/v1/admin/transaction/list-order-pending:
      *   get:
      *     tags:
      *       - AdminTransaction
      *     summary: List order pending admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List order pending admin
      */
      async listOrderPending ({request, response }) {
        var data = request.all()
        const orders = await Order.query().where('status',2).fetch()
        const ordersJSON = orders.toJSON()
        var arrayData = []
        for (var i = 0; i < ordersJSON.length; i++) {
          const totalTransactionBeforeThisOrder = await Transaction.query().where({'order_id' : ordersJSON[i].id , status : 1}).sum("curencyUSD AS totalReceipts")
          var totalReceipts = (totalTransactionBeforeThisOrder[0].totalReceipts != null) ? totalTransactionBeforeThisOrder[0].totalReceipts : 0
          ordersJSON[i].totalReceipts = totalReceipts
          arrayData[i] = ordersJSON[i]

        }
        return response.respondWithSuccess(arrayData , 'List Order Pending Successful!')
      }

      /**
      * swagger
      * /api/v1/admin/transaction/total-transaction-order:
      *   get:
      *     tags:
      *       - AdminTransaction
      *     summary: Total Transacrion order
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: order_id
      *         description: order_id
      *         in: query
      *         required: false
      *         type: unit
      *         example : 5
      *     responses:
      *       200:
      *         description: Total Transacrion order
      */
      async getTotalTransacrion ({request, response }) {
        var data = request.all()
        const orders = await Order.query().where({'status' : 2 , id : data.order_id}).first()
        if (!orders) {
          return response.respondWithSuccess('Can not found the order Id!')
        }
        const totalTransactionBeforeThisOrder = await Transaction.query().where({'order_id' : data.order_id , status : 1}).sum("curencyUSD AS totalReceipts")
        var totalReceipts = (totalTransactionBeforeThisOrder[0].totalReceipts != null) ? totalTransactionBeforeThisOrder[0].totalReceipts : 0
        orders.totalReceipts = totalReceipts
        return response.respondWithSuccess(orders , 'List Total Transacrion Successful!')
      }
      /**
      * @swagger
      * /api/v1/admin/transaction/list:
      *   get:
      *     tags:
      *       - AdminTransaction
      *     summary: List Transaction Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List Transaction Admin
      */
      async list ({request, response }) {
        var data = request.all()
        const transactions = await Transaction.query().fetch()
        return response.respondWithSuccess(transactions , 'List Transaction Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/transaction/create:
       *   post:
       *     tags:
       *       - AdminTransaction
       *     summary: Create Transaction Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: "
            <ul>
                  <li>1. Status  : 1 Completed (Commissions for parents user), 2 Pending</li>
                  <li>1. payment_method :  Cash , BankTransfer, Alepay</li>
                  <li>1. type :  user , admin</li>
            </ul>
       "
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/TransactionCreate'
       *     responses:
       *       200:
       *         description: Create Transaction Admin
       */
      async create ({request, response }) {
        var data = request.all()
        const currencyExchange = await CurrencyExchange.query().where('from_currency','USD').first()
        const orderData = await Order.find(data.order_id)
        var orderPrice = orderData.total_pay /* total this order*/
        const totalTransactionBeforeThisOrder = await Transaction.query().where('order_id',data.order_id).sum("curencyUSD AS totalReceipts")
        var totalReceipts = (totalTransactionBeforeThisOrder[0].totalReceipts != null) ? totalTransactionBeforeThisOrder[0].totalReceipts : 0
        if (!orderData) {
          return response.respondWithSuccess('Can not found the order Id!')
        }
        var customerID = orderData.customer_id
        const transaction = new Transaction()
        transaction.tracsaction_code  = 'ICBRP'
        transaction.order_id          = data.order_id
        transaction.customer_id       = customerID
        transaction.payment_method    = data.payment_method
        transaction.type              = data.type
        transaction.status            = data.status /* status 1 is completed,2 pendding complete*/
        transaction.curencyUSD        = data.amount
        transaction.curencyVND        = data.amount * currencyExchange.to_currency_value
        transaction.fee               = 0
        await transaction.save()
        var str = "" + transaction.id
        var converId = "00000"
        transaction.tracsaction_code = transaction.tracsaction_code + converId.substring(0, converId.length - str.length) + str
        transaction.save()
        /* SEND MAIL */
        var customer = await Customer.query().where('id',orderData.customer_id).first()
        let constTemplateId = use('TemplateId').TEMPLATE_RECIEPT_SUCCESS;
        const ModelSendGird = await use('ModelSendGird').findSlugTemplate(constTemplateId);
        var userData = {
          toEmail : customer.email,
          templateId : ModelSendGird.template_id,
          drawData : {
            full_name  : customer.getFullNameAttribute, //user.getFullNameAttribute(),
            orderCode : orderData.order_code,
            recieptValue : data.amount,
          }
        }
        const  sendGird = await use('SendGird').sendMail(userData)
        var totalToUpCommissions = totalReceipts + transaction.curencyUSD
        // console.log(`totalToUpCommissions : ${totalToUpCommissions} : orderPrice : ${orderPrice}`)
        /* implement commissions if total all receipts == total order orderPrice*/
        if (totalToUpCommissions >= orderPrice && orderData.status != 1) { /* if order uncomplete 100% */
          /* get all order detail buy order id */
          const orderDetail = await OrderDetail.query().where('order_id',data.order_id).fetch()
          const orderDetailJSON = orderDetail.toJSON()
          /* Lopp data order details */
          for (var j = 0; j < orderDetailJSON.length ; j++) {
            var value = orderDetailJSON[j]
            /* get level = 5 | max can commissions*/
            var maxLevelCommissions = 5
            const maxCommisions = await ProductCommisions.query()
            .where({
                  level_type :  maxLevelCommissions,
                  type       : value.type,
                  product_id : value.product_id
            })
            .first()
            var maxValueCommissions = maxCommisions.value /* Max Value Commissions*/
            var defaultCommssions = 0
            var current = 0
            /* get all customer */ /* handle commistions for all level customers */
            const customers   = await Customer.query().orderBy('id','ASC').fetch()
            const objCustomers = customers.toJSON()
            var sponsor_id = customerID , level = 0
            /* Tree Loop user */
            const arrLevelCustomers = showLevelTypeFCustomer(objCustomers , sponsor_id , level)
            /* Sort Buy ASC Level from all customers list*/
            var collection = collect(arrLevelCustomers)
            const sorted = collection.sortBy('level')
            var dataArrLevelCustomers = sorted.all()
            var valueDefault = 0
            var sum = 0
            var array = []
            var userCommissions = []
            for (var i = 0; i < dataArrLevelCustomers.length ; i++) {
              var user = dataArrLevelCustomers[i]
              const productCommisions = await ProductCommisions.query()
                .where({
                  level_type : user.level_commissions,
                  type       : value.type,
                  product_id : value.product_id
                }).first()
              if (productCommisions) {
                sum = sum + (productCommisions.value - valueDefault)
                if(sum <= maxValueCommissions){
                  valueDefault = productCommisions.value - valueDefault
                }else{
                  valueDefault = 0
                }
                // console.log(`User:${user.username} - Level:${user.level_commissions} - Value:${productCommisions.value} - SUM:${sum} - valueDefault : ${valueDefault}`)
                /* Done insert commissions for the table */
                const commissions = new Commission()
                commissions.to_customer_id    = user.id
                commissions.from_customer_id  = customerID
                commissions.product_id        = value.product_id
                commissions.value             = (valueDefault > 0) ? valueDefault : 0
                commissions.level_f           = user.level
                commissions.level_commissions = user.level_commissions
                commissions.order_id          = data.order_id
                commissions.type              = value.type
                commissions.status            = 0
                await commissions.save()
                valueDefault = productCommisions.value
                /* Update commisions for user by field : commissions_earned*/
              }
            }
          }
          /* end commistions for customers */
          /* Update status order 'status=1' compeleted */
          orderData.status = 1
          orderData.save() /* Done Order */
          return response.respondWithSuccess(transaction , 'Create Receipt and Commissions for All Members Successful!')
        }else{
          return response.respondWithSuccess(transaction , 'Create Receipt Successful!')
        }
      }

     /**
      * @swagger
      * /api/v1/admin/transaction/delete:
      *   get:
      *     tags:
      *       - AdminTransaction
      *     summary:  Delete Transaction
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete Transaction
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Server OK!
      */
      async delete ({request, response }) {
        var data = request.all()
        const transaction = await Transaction.query().where('id',data.id).first()
        if (!transaction) {
          return response.respondWithError('Not found id order!')
        }
        /* Update status order to Pending */
        const order = await Order.query().where('id',transaction.order_id).first()
        order.status = 2
        order.save()
        /* Delete Commissions */
        if (transaction) {
          transaction.delete()
          const commissions = await Commission.query().where('from_customer_id',order.customer_id).fetch()
          const commissionsJSON = commissions.toJSON()
          for (var i = 0; i < commissionsJSON.length; i++) {
            var customerID = commissionsJSON[i].to_customer_id
            const customer = await Customer.find(customerID)
            customer.commissions_earned = customer.commissions_earned - commissionsJSON[i].value
            customer.save()
          }
          return response.respondWithSuccess([] , 'Delete Transaction Successful!')
        }
      }
}
module.exports = TransactionController
