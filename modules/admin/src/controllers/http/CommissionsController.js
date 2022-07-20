'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Commission = use('App/Models/Commission')
const Customer = use('App/Models/Customer')
class CommissionsController {
      /**
      * @swagger
      * /api/v1/admin/commissions/list:
      *   get:
      *     tags:
      *       - AdminCommissions
      *     summary: List admin commissions
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List List admin commissions
      */
      async list ({request, response }) {
            var data = request.all()
            const commissions = await Commission.query()
                  .with('from_customer')
                  .with('to_customer')
                  .orderBy('id','DESC')
                  .fetch()
            return response.respondWithSuccess(commissions , 'List Commission Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/commissions/update:
       *   post:
       *     tags:
       *       - AdminCommissions
       *     summary: Update status commissions
       *     description: Update status commissions
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update status commissions
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/CommissionsUpdate'
       *     responses:
       *       200:
       *         description: Server is OK!
       */
	async update ({request, response }) {
            var data = request.all()
            const commissions = await Commission.query().where('id',data.id).where('status','<>',1).first()
            if (!commissions) {
                  return response.respondWithSuccess('Cant found ID commissions!')
            }
            commissions.status = data.status
            commissions.save()
            const userUpdateEarnCommsions = await Customer.find(commissions.to_customer_id)
            userUpdateEarnCommsions.commissions_earned = userUpdateEarnCommsions.commissions_earned + commissions.value
            userUpdateEarnCommsions.save()
            return response.respondWithSuccess(commissions , 'Update Commissions Successful!')
	}
}
module.exports = CommissionsController
