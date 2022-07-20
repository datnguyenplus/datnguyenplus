"use strict";

const Env = use("Env");
const Package = use("App/Models/Package");
const Commission = use("App/Models/Commission");
const Order = use("App/Models/Order");
const OrderDetail = use("App/Models/OrderDetail");
const Customer = use("App/Models/Customer");
const CorePromotion = use("Root/services/PromotionServices");
const BaseService = use("TTSoft/Admin/../utils/BaseServices");
const { validate } = use("Validator");

const { showLevelTypeFCustomer, getCurrentCustomer } = use(
  "App/Libraries/TraitsHelpers"
);

const collect = require("collect.js");
const Database = use("Database");
const Combo = use("App/Models/Combo");
const Transaction = use("App/Models/Transaction");
const CurrencyExchange = use("App/Models/CurrencyExchange");
const ProductCommisions = use("App/Models/ProductCommisions");
const ShoppingCart = use("App/Models/ShoppingCart");
class OrderController extends BaseService {
  /**
   * @swagger
   * /api/v1/list-order-latest:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary: List order latest
   *     description: List order latest
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async listOrderLatest({ request, response }) {
    /* get customer logining */
    const customer = await getCurrentCustomer(request.header("Authorization"));
    const order = await Order.query()
      .where("customer_id", customer.id)
      .with("customer")
      .with("detailOrders")
      .orderBy("id", "DESC")
      .first();
    return response.respondWithSuccess(order, "List Packages Successful!");
  }

  /**
   * @swagger
   * /api/v1/update-payment-view:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary: List order latest
   *     description: List order latest
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async updatePaymentView({ request, response }) {
    var data = request.all();
    /* get customer logining */
    const customer = await getCurrentCustomer(request.header("Authorization"));
    const order = await Order.query()
      .where("customer_id", customer.id)
      .orderBy("id", "DESC")
      .first();
    order.payment_view = 0;
    order.save();
    return response.respondWithSuccess(
      order,
      "Update Payment View Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/list-package:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary: List package
   *     description: List package
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async listPackage({ request, response }) {
    const packages = await Package.query()
      .where("status", 1)
      .orderBy("position", "ASC")
      .fetch();
    return response.respondWithSuccess(packages, "List Packages Successful!");
  }

  /**
   * @swagger
   * /api/v1/list-combo:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary: List combo
   *     description: List combo
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async listCombo({ request, response }) {
    const combos = await Combo.query()
      .where("combo_status", 1)
      .orderBy("position", "ASC")
      .fetch();
    return response.respondWithSuccess(combos, "List Combos Successful!");
  }
  /**
   * @swagger
   * /api/v1/payment-order:
   *   post:
   *     tags:
   *       - FE_Order
   *     summary: Order account
   *     description: Order account
   *     parameters:
   *       - name: object
   *         description: Package ID
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/FrontendInsertOrder'
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async paymentOrder({ request, response }) {
    var data = request.all();
    /* get customer logining */
    const customer = await getCurrentCustomer(request.header("Authorization"));
    /* -------- the end customer have thought conditional to buy the package ---------*/

    var data = request.all();
    /* ------- start insert order by admin --------*/
    const order = new Order();
    order.status = 2;
    order.order_code = "ICB";
    order.customer_id = customer.id;
    order.quantity = data.quantity;
    order.promotion_code = data.promotion_code;
    order.promotion_value = data.promotion_value;
    order.total_pay = data.total_pay;
    order.node = data.node;
    order.payment_type = data.payment_type;
    order.payment_view = 1;
    await order.save();
    var str = "" + order.id;
    var converId = "00000";
    order.order_code =
      order.order_code +
      converId.substring(0, converId.length - str.length) +
      str;
    order.node = data.node;
    order.save();
    /* Insert order detail Can for loop Items if > 1 item */
    var formDataOrderDetails = data.order_details;
    for (var i in formDataOrderDetails) {
      var val = formDataOrderDetails[i];
      const orderDetail = new OrderDetail();
      orderDetail.order_id = order.id;
      orderDetail.product_id = val.product_id;
      orderDetail.quantity = val.quantity;
      orderDetail.price = val.price;
      orderDetail.total = val.total;
      orderDetail.note = val.note;
      orderDetail.last_name = val.last_name;
      orderDetail.first_name = val.first_name;
      orderDetail.phone_number = val.phone_number;
      orderDetail.email = val.email;
      orderDetail.gender = val.gender;
      orderDetail.address = val.address;
      orderDetail.province = val.province;
      orderDetail.country = val.country;
      orderDetail.birthday = val.birthday;
      orderDetail.company = val.company;
      orderDetail.type = val.type;
      orderDetail.name = val.name;
      await orderDetail.save();
    }
    /* end commistions for customers */
    var dataOrderDetails = await Order.query()
      .with("customer")
      .with("detailOrders")
      .where("id", order.id)
      .first();
    /* Insert order detail */

    /* Payment via alepay */
    var data_url_alepay = null;
    if (data.payment_type == "alepay") {
      const currencyExchange = await CurrencyExchange.query()
        .where("from_currency", "USD")
        .first();
      /* Insert Transaction */
      const transaction = new Transaction();
      transaction.tracsaction_code = "ICBRP";
      transaction.order_id = order.id;
      transaction.customer_id = customer.id;
      transaction.payment_method = data.payment_type;
      transaction.type = "user";
      transaction.status = 0; /* status 1 is completed,2 pendding complete*/
      transaction.curencyUSD = data.total_pay;
      transaction.curencyVND =
        data.total_pay * currencyExchange.to_currency_value;
      transaction.fee = 0;
      await transaction.save();
      var str = "" + transaction.id;
      var converId = "00000";
      transaction.tracsaction_code =
        transaction.tracsaction_code +
        converId.substring(0, converId.length - str.length) +
        str;
      transaction.save();
      /* Insert Transaction */
      const objectAlepay = {
        amount: data.total_pay * currencyExchange.to_currency_value,
        buyerAddress: customer.address,
        buyerCity: customer.province,
        buyerCountry: customer.country,
        buyerEmail: customer.email,
        buyerName: `${customer.first_name} ${customer.last_name}`,
        buyerPhone: customer.phone_number,
        cancelUrl: Env.get("CUSTOMER_LINK_ALEPAY_HOOK_CANCEL"),
        currency: "VND",
        orderCode: transaction.tracsaction_code,
        orderDescription: `New order ${new Date()}`,
        paymentHours: 1,
        returnUrl: Env.get("CUSTOMER_LINK_ALEPAY_HOOK_SUCCESSED"),
        totalItem: data.quantity,
        checkoutType: 1,
      };
      const alepay = use("App/Libraries/Alepay");
      const result = await alepay.exeTransaction(objectAlepay);
      var data_url_alepay = result.data;
    }
    dataOrderDetails.alepayData = data_url_alepay;
    const listShoppingCart = await ShoppingCart.query()
      .where("customer_id", customer.id)
      .delete();
    return response.respondWithSuccess(
      dataOrderDetails,
      "Checkout Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/list-package-bought:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary:  Report
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: order_id
   *         in: query
   *         required: false
   *         type: string
   *         example : "ICB00001"
   *
   *       - name: from_date
   *         in: query
   *         required: false
   *         type: string
   *         example : "2019-06-26"
   *
   *       - name: to_date
   *         in: query
   *         required: false
   *         type: string
   *         example : "2019-07-26"
   *
   *       - name: status
   *         in: query
   *         required: false
   *         description : "1 Completed, 2 New , 3 Pending Payment"
   *         type: unit
   *         example : 1
   *
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async listPackageBought({ request, response }) {
    var data = request.all();
    /* get customer logining */
    const customer = await getCurrentCustomer(request.header("Authorization"));
    const orders = Database.table("orders")
      .orderBy("orders.id", "desc")
      .select(
        "orders.id",
        "orders.order_code",
        "orders.quantity",
        "orders.promotion_code",
        "orders.promotion_value",
        "orders.gross_profit",
        "orders.total_commission",
        "orders.total_pay",
        "orders.gross_profit",
        "orders.payment_type",
        "orders.status",
        "customers.id as customer_id",
        Database.raw("DATE_FORMAT(orders.created_at,'%Y-%m-%d') as created_at"),
        Database.raw("DATE_FORMAT(orders.updated_at,'%Y-%m-%d') as updated_at")
      )
      .innerJoin("customers", function (builder) {
        builder.on("orders.customer_id", "customers.id");
      });
    /* filter order id */
    if (data.order_id != "undefined" && data.order_id != null) {
      orders.whereRaw(`orders.order_code LIKE "%${data.order_id}%"`);
    }
    /* filter status 1 Completed, 2 New , 3 Pending Payment */
    if (data.status != "undefined" && data.status != null) {
      orders.whereRaw(`orders.status = ?`, data.status);
    }
    /* filter from date */
    if (data.from_date != "undefined" && data.from_date != null) {
      orders.whereRaw(
        `DATE_FORMAT(orders.created_at,'%Y-%m-%d') >= "${data.from_date}"`
      );
    }
    /* filter to date */
    if (data.to_date != "undefined" && data.to_date != null) {
      orders.whereRaw(
        `DATE_FORMAT(orders.created_at,'%Y-%m-%d') <= "${data.to_date}"`
      );
    }
    orders.where("customers.id", customer.id);
    const results = await orders;
    return response.respondWithSuccess(
      results,
      "List Sales Report Successful!"
    );
  }
  /**
   * @swagger
   * /api/v1/order-detail:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary: Order ID
   *     parameters:
   *       - name: order_id
   *         description: Order ID
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
  async reportViewDetail({ request, response }) {
    var data = request.all();
    const order = await Order.query()
      .with("customer")
      .where("id", data.order_id)
      .first();
    const order_details = await OrderDetail.query()
      .where("order_id", data.order_id)
      .with("package")
      .orderBy("id", "DESC")
      .fetch();
    const data_detail = {
      order: order,
      order_details: order_details,
    };
    return response.respondWithSuccess(
      data_detail,
      "List Sales Report Detail Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/check-promotion-code:
   *   post:
   *     tags:
   *       - FE_Order
   *     summary: Check Promotion Code
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: info
   *         description: Check Promotion Code (price tính theo giá value, percent tính theo % value)
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/CheckPromotionCode'
   *     responses:
   *       200:
   *         description: Server OK!
   */

  async checkPromotionCode({ request, response }) {
    const data = request.all(),
      { usrId } = await this.getUsrId(request.header("Authorization"));
    const rules = {
      promotion_code: "required",
      prodId: "number",
    };

    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is failed!",
        validation.messages()
      );
    }

    const promotion = await CorePromotion.checkPromotion(
      data.promotion_code,
      usrId,
      data.prodId
    );
    if (!promotion) {
      return response.respondWithError(
        "Promotion code expired or has been used!"
      );
    }
    return response.respondWithSuccess(
      promotion,
      "Get infomation promotion successful!"
    );
  }

  /* HOOK Alepay */
  async alepayHook({ request, response }) {
    var data = request.all();
    /* Insert data json*/
    var objectData = JSON.stringify(data);
    const firstUserId = await Database.from("data_hook_alepays").insert({
      customer_id: 1,
      objects: objectData,
    });

    var transactionInfo = data.transactionInfo;

    if (transactionInfo.status == "000") {
      const currencyExchange = await CurrencyExchange.query()
        .where("from_currency", "USD")
        .first();
      const transaction = await Transaction.query()
        .where("tracsaction_code", transactionInfo.orderCode)
        .first();
      if (transaction) {
        const orderData = await Order.find(transaction.order_id);
        var orderPrice = orderData.total_pay; /* total this order*/
        var valueData =
          transactionInfo.amount / currencyExchange.to_currency_value;
        const totalTransactionBeforeThisOrder = await Transaction.query()
          .where("order_id", orderData.id)
          .where("status", 1)
          .sum("curencyUSD AS totalReceipts");
        var totalReceipts =
          totalTransactionBeforeThisOrder[0].totalReceipts != null
            ? totalTransactionBeforeThisOrder[0].totalReceipts
            : 0;
        var customerID = orderData.customer_id;
        var totalToUpCommissions = totalReceipts + transaction.curencyUSD;
        if (totalToUpCommissions >= orderPrice && orderData.status != 1) {
          /* if order uncomplete 100% */
          /* get all order detail buy order id */
          const orderDetail = await OrderDetail.query()
            .where("order_id", data.order_id)
            .fetch();
          const orderDetailJSON = orderDetail.toJSON();
          /* Lopp data order details */
          for (var j = 0; j < orderDetailJSON.length; j++) {
            var value = orderDetailJSON[j];
            /* get level = 5 | max can commissions*/
            var maxLevelCommissions = 5;
            const maxCommisions = await ProductCommisions.query()
              .where({
                level_type: maxLevelCommissions,
                type: value.type,
                product_id: value.product_id,
              })
              .first();
            var maxValueCommissions =
              maxCommisions.value; /* Max Value Commissions*/
            var defaultCommssions = 0;
            var current = 0; /* handle commistions for all level customers */
            /* get all customer */ const customers = await Customer.query()
              .orderBy("id", "ASC")
              .fetch();
            const objCustomers = customers.toJSON();
            var sponsor_id = customerID,
              level = 0;
            /* Tree Loop user */
            const arrLevelCustomers = showLevelTypeFCustomer(
              objCustomers,
              sponsor_id,
              level
            );
            /* Sort Buy ASC Level from all customers list*/
            var collection = collect(arrLevelCustomers);
            const sorted = collection.sortBy("level");
            var dataArrLevelCustomers = sorted.all();
            var valueDefault = 0;
            var sum = 0;
            var array = [];
            var userCommissions = [];
            for (var i = 0; i < dataArrLevelCustomers.length; i++) {
              var user = dataArrLevelCustomers[i];
              const productCommisions = await ProductCommisions.query()
                .where({
                  level_type: user.level_commissions,
                  type: value.type,
                  product_id: value.product_id,
                })
                .first();
              if (productCommisions) {
                sum = sum + (productCommisions.value - valueDefault);
                if (sum <= maxValueCommissions) {
                  valueDefault = productCommisions.value - valueDefault;
                } else {
                  valueDefault = 0;
                }
                // console.log(`User:${user.username} - Level:${user.level_commissions} - Value:${productCommisions.value} - SUM:${sum} - valueDefault : ${valueDefault}`)
                /* Done insert commissions for the table */
                const commissions = new Commission();
                commissions.to_customer_id = user.id;
                commissions.from_customer_id = customerID;
                commissions.product_id = value.product_id;
                commissions.value = valueDefault;
                commissions.level_f = user.level;
                commissions.level_commissions = user.level_commissions;
                commissions.order_id = data.order_id;
                commissions.type = value.type;
                commissions.status = 0;
                await commissions.save();
                valueDefault = productCommisions.value;
                /* Update commisions for user by field : commissions_earned*/
              }
            }
            /* end commistions for customers */
            /* Update status order 'status=1' compeleted */
            orderData.status = 1;
            orderData.save(); /* Done Order */
            /* Update transactions */
            transaction.status = 1;
            transaction.save();
          }
        }
      }
    }
    return response.respondWithSuccess(data);
  }

  /**
   * @swagger
   * /api/v1/commissions:
   *   get:
   *     tags:
   *       - FE_Order
   *     summary:  FE_Order
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
  async commissionsReportForUser({ request, response }) {
    var data = request.all();
    /* get customer logining */
    const customer = await getCurrentCustomer(request.header("Authorization"));
    var data = request.all();
    const commissions = Database.table("commissions")
      .orderBy("commissions.id", "desc")
      .select(
        "commissions.id",
        "commissions.product_id",
        "commissions.value",
        "commissions.level_f",
        "commissions.level_commissions",
        "commissions.order_id",
        "commissions.status",
        "commissions.type",
        "fromCustomers.id as from_customer_id",
        "fromCustomers.first_name as from_first_name",
        "fromCustomers.last_name as from_last_name",
        "fromCustomers.level_commissions as from_level_commissions",
        "fromCustomers.email as from_email",
        "toCustomers.id as to_customer_id",
        "toCustomers.first_name as to_first_name",
        "toCustomers.last_name as to_last_name",
        "toCustomers.level_commissions as to_level_commissions",
        "toCustomers.email as to_email",
        "orders.id as orderID",
        "orders.order_code as order_code",
        Database.raw(
          "DATE_FORMAT(commissions.created_at,'%Y-%m-%d') as created_at"
        ),
        Database.raw(
          "DATE_FORMAT(commissions.updated_at,'%Y-%m-%d') as updated_at"
        )
      )
      .innerJoin(Database.raw("customers as fromCustomers"), function (
        builder
      ) {
        builder.on("commissions.from_customer_id", "fromCustomers.id");
      })
      .innerJoin(Database.raw("customers as toCustomers"), function (builder) {
        builder.on("commissions.to_customer_id", "toCustomers.id");
      })
      .innerJoin("orders", function (builder) {
        builder.on("commissions.order_id", "orders.id");
      });
    commissions.where("toCustomers.id", customer.id);
    /* filter from customer id array */
    if (data.from_customer_id != "undefined" && data.from_customer_id != null) {
      var fromCustomer = data.from_customer_id;
      var str = fromCustomer.split(",");
      commissions.whereIn("fromCustomers.id", str);
    }
    /* order_code*/
    if (data.order_code != "undefined" && data.order_code != null) {
      var order_code = data.order_code;
      var str = order_code.split(",");
      commissions.whereIn("orders.order_code", str);
    }
    /* filter status 1 Approved, 2 Pedding */
    if (data.status != "undefined" && data.status != null) {
      var status = data.status;
      var str = status.split(",");
      commissions.whereIn("commissions.status", str);
    }
    /* filter from date */
    if (data.from_date != "undefined" && data.from_date != null) {
      commissions.whereRaw(
        `DATE_FORMAT(commissions.created_at,'%Y-%m-%d') >= "${data.from_date}"`
      );
    }
    /* filter to date */
    if (data.to_date != "undefined" && data.to_date != null) {
      commissions.whereRaw(
        `DATE_FORMAT(commissions.created_at,'%Y-%m-%d') <= "${data.to_date}"`
      );
    }
    const results = await commissions;
    return response.respondWithSuccess(results, "List Commissions Successful!");
  }
}
module.exports = OrderController;
