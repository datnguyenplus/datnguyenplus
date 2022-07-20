'use strict'

const Env = use('Env')
const Helpers = use('App/Libraries/Helpers')
const Customer = use('App/Models/Customer')
const Withdraw = use('App/Models/Withdraw')
const {
  getCurrentCustomer , 
  getChildCustomerTree , 
  showTreeChildrenCustomer
} = use('App/Libraries/TraitsHelpers')
const ConfigCommissions = use('App/Models/ConfigCommissions')
const Commission = use('App/Models/Commission')
const Order = use('App/Models/Order')
const OrderDetail = use('App/Models/OrderDetail')
const ICBNews = use('App/Models/ICBNews')
const Config = use('Config')
class DashboardController {
/**
   * @swagger
   * /api/v1/dashboard/info:
   *   get:
   *     tags:
   *       - FE_Dashboard
   *     summary: Dashboard
   *     security:
   *       - Bearer: []
   *     description: Dashboard
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  	async index ({request, response }) {
        let data = request.all()
        const auth = await getCurrentCustomer(request.header('Authorization'))
        const customer = await Customer.query().with('levelInfoCommissions')
          .select('id','first_name','last_name','sponsorKey','commissions_earned','level_commissions')
          .where('id',auth.id)
          .first()
        const orders = await Order.query().with('customer').where('customer_id',auth.id).orderBy('id','desc').limit(5).fetch()
        const news = await ICBNews.query().where('level_id',auth.level_commissions).limit(5).fetch()
        const icarebaseTree = Config.get('app.icarebaseTree')
        const totalCommissions = await Commission.query().where({'to_customer_id' : auth.id , status : 1}).sum("value AS totalCommissions")
        let totalCommissionsCurrent = (totalCommissions[0].totalCommissions != null) ? totalCommissions[0].totalCommissions : 0
        customer.total_commissions = totalCommissionsCurrent
        let date = new Date();
        let mouth = date.getMonth();
        let firstDay = new Date(date.getFullYear(), mouth, 1);
        firstDay =  firstDay.toISOString().slice(0,10)
        let lastDay = new Date(date.getFullYear(), mouth + 1, 0);
        lastDay = lastDay.toISOString().slice(0,10);
        // console.log(lastDay , firstDay);
        let withdraw = await Withdraw.query()
          .whereRaw(`DATE_FORMAT(created_at,'%Y-%m-%d') >= "${firstDay}" AND DATE_FORMAT(created_at,'%Y-%m-%d') <= "${lastDay}"`)
          .where('customer_id',auth.id)
          .fetch();
        withdraw = withdraw.toJSON()
        let object = {
          customer : customer,
          orders : orders,
          news : news,
          is_withdraw_in_mouth : (withdraw && withdraw.length > 1) ? 1 : 0,
        }
        return response.respondWithSuccess(object , 'Get info dashboard successful!')
  	}
    /**
     * @swagger
     * /api/v1/news/list:
     *   get:
     *     tags:
     *       - FE_News
     *     summary: News
     *     security:
     *       - Bearer: []
     *     description: News
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async getAllNews ({request, response }) {
      const auth = await getCurrentCustomer(request.header('Authorization'))
      const news = await ICBNews.query().where('level_id',auth.level_commissions).fetch()
      return response.respondWithSuccess(news , 'Get all news successful!')
    }

    /**
     * @swagger
     * /api/v1/news/detail:
     *   get:
     *     tags:
     *       - FE_News
     *     summary: News
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - name: id
     *         description: News ID
     *         in: query
     *         required: false
     *         type: unit
     *         example : 1
     *     description: News Detail
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async getDetailNews ({request, response }) {
      var data = request.all()
      const auth = await getCurrentCustomer(request.header('Authorization'))
      const news = await ICBNews.query().where('level_id',auth.level_commissions).where('id',data.id).first()
      if (!news) {
        return response.respondWithError('Not found News ID!')
      }
      return response.respondWithSuccess(news , 'Get detail news successful!')
    }

    
}
module.exports = DashboardController
