'use strict'

const Env = use('Env')
const Mail = use('Mail')
const path = require('path')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
const Helpers = use('Helpers')
const HelperLibraries = use('App/Libraries/Helpers')
const Order = use('App/Models/Order')
const OrderDetail = use('App/Models/OrderDetail')
const Customer = use('App/Models/Customer')
const Product = use('App/Models/Package')
const Combo = use('App/Models/Combo')
const Transaction = use('App/Models/Transaction')
const Commission = use('App/Models/Commission')
const {
  showLevelTypeFCustomer , 
  getCurrentCustomer,
  showTreeChildrenCustomer
} = use('App/Libraries/TraitsHelpers')
class ReportController {
	/**
  	* @swagger
  	* /api/v1/admin/report/sales-report:
  	*   get:
  	*     tags:
  	*       - AdminReport
  	*     summary:  Báo cáo đơn hàng
  	*     security:
  	*       - Bearer: []
    *     description: "http://api.icarebase.com/api/v1/admin/report/sales-report?from_date=20-09-2019&to_date=30-09-2019&customers=1,2&status=1&order_code=ICB00206,ICB00205"
  	*     parameters: 
    *       - name: order_code
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *         
    *       - name: from_date
    *         in: query
    *         required: false
    *         type: string
    *         example : ""
    *         
    *       - name: to_date
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *
    *       - name: customers
    *         in: query
    *         required: false
    *         description : "Multiple Select"
    *         type: string
    *         example : "" 
    *         
    *       - name: status
    *         in: query
    *         required: false
    *         description : "1 Completed, 2 New , 3 Pending Payment"
    *         type: unit
    *         example : ""
    *         
    *     responses:
    *       200:
    *         description: Server OK!
    *       500:
    *         description: Error Server Internal!
  	*/
  	async reportView ({request, response }) {
      var data = request.all()
      const orders = Database.table('orders')
      .orderBy('orders.id','desc')
      .select(
        'orders.id',
        'orders.order_code',
        'orders.quantity',
        'orders.promotion_code',
        'orders.promotion_value',
        'orders.gross_profit',
        'orders.total_commission',
        'orders.total_pay',
        'orders.gross_profit',
        'orders.payment_type',
        'orders.status',
        'customers.id as customerId',
        'customers.first_name',
        'customers.last_name',
        'customers.level_commissions',
        'customers.email',
        Database.raw("DATE_FORMAT(orders.created_at,'%Y-%m-%d') as created_at"),
        Database.raw("DATE_FORMAT(orders.updated_at,'%Y-%m-%d') as updated_at"),
      )
      .innerJoin('customers', function (builder) {
        builder.on('orders.customer_id', 'customers.id')
      })
      /* filter order id */
      if (data.order_code !='undefined' && data.order_code != null) {
        var orderCode = data.order_code
        var str = orderCode.split(",")
        orders.whereIn('orders.order_code',str)
      }
      /* filter customer id array */
      if (data.customers !='undefined' && data.customers != null) {
        var strCustomer = data.customers
        var str = strCustomer.split(",")
        orders.whereIn('customers.id', str)
      }
      /* filter status 1 Completed, 2 New , 3 Pending Payment */
      if (data.status !='undefined' && data.status != null) {
        var status = data.status
        var str = status.split(",")
        orders.whereIn('orders.status', str)
      }
      /* filter from date */
      if (data.from_date !='undefined' && data.from_date != null) {
        orders.whereRaw(`DATE_FORMAT(orders.created_at,'%Y-%m-%d') >= "${data.from_date}"`)
      }
      /* filter to date */
      if (data.to_date !='undefined' && data.to_date != null) {
        orders.whereRaw(`DATE_FORMAT(orders.created_at,'%Y-%m-%d') <= "${data.to_date}"`)
      }
      const results = await orders
      return response.respondWithSuccess(results , 'List Sales Report Successful!');
  	}
    /**
    * @swagger
    * /api/v1/admin/report/sales-report-detail:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary: Order ID
    *     parameters:
    *       - name: order_id
    *         description:  Báo cáo đơn hàng chi tiết (Order, Order Details, Receipts)
    *         in: query
    *         required: true
    *         type: string
    *         exemple: 1
    *     security:
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Server OK!
    */
  	async reportViewDetail ({request, response }) {
      var data = request.all()
      const order = await Order.query().with('customer').where('id',data.order_id).first()
      if(order){
        const orderDetails = await OrderDetail.query()
          .where('order_id',data.order_id)
          .with('package')
          .orderBy('id','DESC')
          .fetch()
        const transactions = await Transaction.query().where('order_id',data.order_id).fetch()
        order.orderDetails = orderDetails
        order.receipts = transactions
        return response.respondWithSuccess(order , 'List Sales Report Detail Successful!')
      }
      return response.respondWithError('The ID order not found!')
  	}

    /**
    * @swagger
    * /api/v1/admin/report/transaction-history:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary:  Báo cáo Receipts (Phiếu thu chi tiết)
    *     security:
    *       - Bearer: []
    *     parameters: 
    *       - name: tracsaction_code
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *         description : "Multiple Select"
    *         
    *       - name: from_date
    *         in: query
    *         required: false
    *         type: string
    *         example : ""
    *         
    *       - name: to_date
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *
    *       - name: customers
    *         in: query
    *         required: false
    *         description : "Multiple Select"
    *         type: string
    *         example : "" 
    *         
    *       - name: status
    *         in: query
    *         required: false
    *         description : "Multiple Select : 1 Completed, 2 Failed"
    *         type: unit
    *         example : ""
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async transactionHistory ({request, response }) {
      var data = request.all()
      const transactions = Database.table('transactions')
      .orderBy('transactions.id','desc')
      .select(
        'transactions.id',
        'transactions.tracsaction_code',
        'transactions.payment_method',
        'transactions.customer_id',
        'transactions.type',
        'transactions.amount',
        'transactions.curencyVND',
        'transactions.curencyUSD',
        'transactions.status',
        'customers.id as customerId',
        'customers.first_name',
        'customers.last_name',
        'customers.level_commissions',
        'customers.email',
        'orders.id as orderID',
        'orders.order_code as order_code',
        Database.raw("DATE_FORMAT(transactions.created_at,'%Y-%m-%d') as created_at"),
        Database.raw("DATE_FORMAT(transactions.updated_at,'%Y-%m-%d') as updated_at"),
      )
      .innerJoin('customers', function (builder) {
        builder.on('transactions.customer_id', 'customers.id')
      })
      .innerJoin('orders', function (builder) {
        builder.on('transactions.order_id', 'orders.id')
      })
      /* filter order id */
      if (data.tracsaction_code !='undefined' && data.tracsaction_code != null) {
        var orderCode = data.tracsaction_code
        var str = orderCode.split(",")
        transactions.whereIn('transactions.tracsaction_code',str)
      }
      /* filter customer id array */
      if (data.customers !='undefined' && data.customers != null) {
        var strCustomer = data.customers
        var str = strCustomer.split(",")
        transactions.whereIn('customers.id', str)
      }
      /* filter status 1 Completed, 2 New , 3 Pending Payment */
      if (data.status !='undefined' && data.status != null) {
        var status = data.status
        var str = status.split(",")
        transactions.whereIn('transactions.status', str)
      }
      /* filter from date */
      if (data.from_date !='undefined' && data.from_date != null) {
        transactions.whereRaw(`DATE_FORMAT(transactions.created_at,'%Y-%m-%d') >= "${data.from_date}"`)
      }
      /* filter to date */
      if (data.to_date !='undefined' && data.to_date != null) {
        transactions.whereRaw(`DATE_FORMAT(transactions.created_at,'%Y-%m-%d') <= "${data.to_date}"`)
      }
      const results = await transactions
      return response.respondWithSuccess(results , 'List Transactions Successful!');
    }

    /**
    * @swagger
    * /api/v1/admin/report/commissions-report:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary:  Report
    *     security:
    *       - Bearer: []
    *     parameters: 
    *       - name: from_date
    *         in: query
    *         required: false
    *         type: string
    *         example : ""
    *         
    *       - name: to_date
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *
    *       - name: from_customer_id
    *         in: query
    *         required: false
    *         description : "Multiple Select"
    *         type: string
    *         example : "" 

    *       - name: to_customer_id
    *         in: query
    *         required: false
    *         description : "Multiple Select"
    *         type: string
    *         example : "" 

    *       - name: order_code
    *         in: query
    *         required: false
    *         description : "Multiple Select"
    *         type: string
    *         example : "" 
    *         
    *       - name: status
    *         in: query
    *         required: false
    *         description : "Multiple Select : 1 Approved, 0 Pendding"
    *         type: unit
    *         example : ""
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async commissionsReport ({request, response }) {
      var data = request.all()
      const commissions = Database.table('commissions')
      .orderBy('commissions.id','desc')
      .select(
        'commissions.id',
        'commissions.product_id',
        'commissions.value',
        'commissions.level_f',
        'commissions.level_commissions',
        'commissions.order_id',
        'commissions.status',
        'commissions.type',
        'fromCustomers.id as from_customer_id',
        'fromCustomers.first_name as from_first_name',
        'fromCustomers.last_name as from_last_name',
        'fromCustomers.level_commissions as from_level_commissions',
        'fromCustomers.email as from_email',
        'toCustomers.id as to_customer_id',
        'toCustomers.first_name as to_first_name',
        'toCustomers.last_name as to_last_name',
        'toCustomers.level_commissions as to_level_commissions',
        'toCustomers.email as to_email',
        'orders.id as orderID',
        'orders.order_code as order_code',
        Database.raw("DATE_FORMAT(commissions.created_at,'%Y-%m-%d') as created_at"),
        Database.raw("DATE_FORMAT(commissions.updated_at,'%Y-%m-%d') as updated_at"),
      )
      .innerJoin(Database.raw('customers as fromCustomers'), function (builder) {
        builder.on('commissions.from_customer_id', 'fromCustomers.id')
      })
      .innerJoin(Database.raw('customers as toCustomers'), function (builder) {
        builder.on('commissions.to_customer_id', 'toCustomers.id')
      })
      .innerJoin('orders', function (builder) {
        builder.on('commissions.order_id', 'orders.id')
      })
      /* filter to customer id array */
      if (data.to_customer_id !='undefined' && data.to_customer_id != null) {
        var toCustomer = data.to_customer_id
        var str = toCustomer.split(",")
        commissions.whereIn('toCustomers.id', str)
      }
      /* filter from customer id array */
      if (data.from_customer_id !='undefined' && data.from_customer_id != null) {
        var fromCustomer = data.from_customer_id
        var str = fromCustomer.split(",")
        commissions.whereIn('fromCustomers.id', str)
      }
      /* order_code*/
      if (data.order_code !='undefined' && data.order_code != null) {
        var order_code = data.order_code
        var str = order_code.split(",")
        commissions.whereIn('orders.order_code', str)
      }
      /* filter status 1 Approved, 2 Pedding */
      if (data.status !='undefined' && data.status != null) {
        var status = data.status
        var str = status.split(",")
        commissions.whereIn('commissions.status', str)
      }
      /* filter from date */
      if (data.from_date !='undefined' && data.from_date != null) {
        commissions.whereRaw(`DATE_FORMAT(commissions.created_at,'%Y-%m-%d') >= "${data.from_date}"`)
      }
      /* filter to date */
      if (data.to_date !='undefined' && data.to_date != null) {
        commissions.whereRaw(`DATE_FORMAT(commissions.created_at,'%Y-%m-%d') <= "${data.to_date}"`)
      }
      const results = await commissions
      return response.respondWithSuccess(results , 'List Commissions Successful!');
    }

    /**
    * @swagger
    * /api/v1/admin/report/commissions-report-customer:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary:  Report
    *     security:
    *       - Bearer: []
    *     parameters:      
    *       - name: customer_id
    *         description: Customer ID
    *         in: query
    *         required: false
    *         type: unit
    *         example : 1
    *     responses:
    *       200:
    *         description: Server OK!
    */
    async commissionsReportForUser ({request, response }) {
      var data = request.all()
      const commissions = await Commission.query()
        .with('from_customer')
        .with('to_customer')
        .with('package')
        .where('to_customer_id',data.customer_id)
        .orderBy('id','DESC').fetch()
      return response.respondWithSuccess(commissions , 'List Commissions For Customer Successful!')
    }

    /**
    * @swagger
    * /api/v1/admin/report/report-partner:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary:  Report Partner
    *     security:
    *       - Bearer: []
    *     parameters: 
    *       - name: from_date
    *         in: query
    *         required: false
    *         type: string
    *         example : ""
    *         
    *       - name: to_date
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *     responses:
    *       200:
    *         description: Server OK!
    *       500:
    *         description: Error Server Internal!
    */
    async reportPartner({request, response }){
      var data = request.all()
      const customers   = await Database.table('customers').orderBy('id','ASC')
      const reportPartners = await Database.table('customers')
        .select(Database.raw("id,CONCAT(last_name,' ',first_name) as full_name,level_commissions,email,phone_number,commissions_earned AS balance,sponsor_id,sponsorKey, username,gender,created_at,updated_at"))
        .where('level_commissions',5)
        .orderBy('id','ASC')
      var resultData = [];
      for (var i = 0; i < reportPartners.length; i++) {
        var resultArrayID = [];
        let customer = reportPartners[i];
        const customerChildrens = showTreeChildrenCustomer(customers , customer.id , 0);
        /* Push all customer id in array */
        customerChildrens.forEach(function(value , key){
          resultArrayID.push(value.id)
        });
        let totalOrderMoney = 0
        const orders = await Database.table('orders').select(Database.raw("id,customer_id,total_pay,created_at"))
          .whereIn("customer_id",resultArrayID)
          .orderBy('id','DESC');
        var totalPackage = 0;
        var totalCombo = 0;
        for (var j = 0; j < orders.length; j++) {
          let order = orders[j];
          totalOrderMoney += order.total_pay;
          const comboOrder = await Database.table('order_details')
            .select(Database.raw("id,type,order_id,created_at"))
            .where("order_id",order.id)
            .where('type','combo')
            .orderBy('id','DESC');
          const packageOrder = await Database.table('order_details')
            .select(Database.raw("id,type,order_id,created_at"))
            .where("order_id",order.id)
            .where('type','package')
            .orderBy('id','DESC');
          totalCombo += comboOrder.length
          totalPackage += packageOrder.length
        }
        /* total order complate */
        let totalOrderMoneyComplete = 0
        const ordersComplete = await Database.table('orders').select(Database.raw("id,customer_id,total_pay,created_at"))
          .whereIn("customer_id",resultArrayID)
          .where('status',1)
          .orderBy('id','DESC');
        ordersComplete.forEach(function(order){
          totalOrderMoneyComplete+=order.total_pay
        });

        /* LEVEL 4*/
        let level4 = customerChildrens.filter(function(v){return v.level_commissions == 4 && v.id != customer.id});
        level4 = level4.length;
        customer.level4 = level4;
        /* LEVEL 3*/
        let level3 = customerChildrens.filter(function(v){return v.level_commissions == 3 && v.id != customer.id});
        level3 = level3.length;
        customer.level3 = level3;
        /* LEVEL 2*/
        let level2 = customerChildrens.filter(function(v){return v.level_commissions == 2 && v.id != customer.id});
        level2 = level2.length;
        customer.level2 = level2;
        /* LEVEL 1*/
        let level1 = customerChildrens.filter(function(v){return v.level_commissions == 1 && v.id != customer.id});
        level1 = level1.length;
        customer.level1 = level1;
        /* LEVEL 4*/
        let level0 = customerChildrens.filter(function(v){return (v.level_commissions == 0 || v.level_commissions == null) && v.id != customer.id});
        level0 = level0.length;
        customer.level0 = level0;
        /* Total money Order */
        customer.totalOrderMoney = totalOrderMoney
        /* Total money Order */
        customer.totalOrderMoneyComplete = totalOrderMoneyComplete
        /* Total money Order */
        customer.totalOrder = orders.length
        /* Total money Order */
        customer.totalOrderComplete = ordersComplete.length
        /* Total package Order */
        customer.totalPackage = totalPackage
        customer.totalCombo   = totalCombo
        resultData[i] = customer;
      }
      return response.respondWithSuccess(resultData , 'Report partner succesful!')
    }


    /**
    * @swagger
    * /api/v1/admin/report/report-package:
    *   get:
    *     tags:
    *       - AdminReport
    *     summary:  Report Package
    *     security:
    *       - Bearer: []
    *     parameters: 
    *       - name: from_date
    *         in: query
    *         required: false
    *         type: string
    *         example : ""
    *         
    *       - name: to_date
    *         in: query
    *         required: false
    *         type: string
    *         example : "" 
    *     responses:
    *       200:
    *         description: Server OK!
    *       500:
    *         description: Error Server Internal!
    */
    async reportPackage({request, response }){
      var data = request.all();
      const products = await Database.table('products').orderBy('id','DESC');
      var results = [];
      for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let qty = 0;
        let comlepte = 0;
        let first_paid = 0;
        let unpaid = 0;
        let orderQty = await Database.table('order_details')
          .select(Database.raw("orders.*,order_details.order_id AS orderId,order_details.type"))
          .innerJoin(Database.raw('orders'), function (builder) {
            builder.on('order_details.order_id', 'orders.id')
          })
          .where({'order_details.product_id' : product.id , 'order_details.type' : 'package'})
          .groupBy('orders.id');
        for (let j = 0; j < orderQty.length; j++) {
          qty += orderQty[j].quantity;
        }
        let orderComlepte = await Database.table('order_details')
          .select(Database.raw("orders.*,order_details.order_id AS orderId,order_details.type"))
          .innerJoin(Database.raw('orders'), function (builder) {
            builder.on('order_details.order_id', 'orders.id')
          })
          .where({'order_details.product_id' : product.id , 'order_details.type' : 'package','orders.status' : 1})
          .groupBy('orders.id');
        for (let j = 0; j < orderComlepte.length; j++) {
          comlepte += orderComlepte[j].quantity;
        }
        /* first_paid */
        let orderFirstpaid = await Database.table('order_details')
          .select(Database.raw("orders.*,order_details.order_id AS orderId,order_details.type"))
          .innerJoin(Database.raw('orders'), function (builder) {
            builder.on('order_details.order_id', 'orders.id')
          })
          .where({'order_details.product_id' : product.id , 'order_details.type' : 'package','orders.status' : 2})
          .groupBy('orders.id');
        console.log(orderFirstpaid);
        for (let n = 0; n < orderFirstpaid.length; n++) {
          let transaction = await Database.table('transactions').where('order_id',orderFirstpaid[n].id).first();
          if (transaction) {
            first_paid += orderFirstpaid[n].quantity;
          }else{
            unpaid     += orderFirstpaid[n].quantity;
          }
        }
        /* unpaid */
        product.qty = qty;
        product.comlepte = comlepte;
        product.first_paid = first_paid;
        product.unpaid = unpaid;
        results[i] = product;
      }
      return response.respondWithSuccess(results , 'Report packages succesful!');
    }
}
module.exports = ReportController
