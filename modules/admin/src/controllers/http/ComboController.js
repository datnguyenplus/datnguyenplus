'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Combo = use('App/Models/Combo')
const MessageCode = use('App/Libraries/MessageCode')
const Helpers = use('App/Libraries/Helpers')
class ComboController {
      /**
      * @swagger
      * /api/v1/admin/combo/list:
      *   get:
      *     tags:
      *       - AdminCombo
      *     summary: List Combo
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Package
      */
      async list ({request, response }) {
            var data = request.all()
            const combos = await Combo.query().orderBy('position','ASC').fetch()
            return response.respondWithSuccess(combos , 'List Combo Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/combo/create:
       *   post:
       *     tags:
       *       - AdminCombo
       *     summary: Create Combo
       *     security:
       *       - Bearer: []
       *     description: Create Combo
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create Combo
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/ComboCreate'
       *     responses:
       *       200:
       *         description: Create Package
       */
      async create ({request, response }) {
            var data = request.all()
            const combo = new Combo()
            combo.combo_name = data.combo_name
            combo.combo_description = data.combo_description
            combo.combo_status = data.combo_status
            combo.product_of_combo = JSON.stringify(data.product_of_combo)
            combo.price = data.price
            combo.discounts = data.discounts
            await combo.save()
            return response.respondWithSuccess(combo , 'Add Combo Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/combo/edit:
      *   get:
      *     tags:
      *       - AdminPackageCategory
      *     summary: Edit Combo
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Combo
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Combo
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const combo = await Combo.find(data.id)
            if (!combo) {
                  return response.respondWithError('Not found id category!')
            }
            return response.respondWithSuccess(combo , 'Get Id Combo Successful!')
      }

      /**
       * @swagger
       * /api/v1/admin/combo/update:
       *   post:
       *     tags:
       *       - AdminCombo
       *     summary: Update Combo
       *     description: Update Combo
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Combo
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/ComboUpdate'
       *     responses:
       *       200:
       *         description: Update Combo
       */
      async update ({request, response }) {
            var data = request.all()
            const combo = await Combo.find(data.id)
            combo.combo_name = data.combo_name
            combo.combo_description = data.combo_description
            combo.combo_status = data.combo_status
            combo.product_of_combo = JSON.stringify(data.product_of_combo)
            combo.price = data.price
            combo.discounts = data.discounts
            combo.save()
            return response.respondWithSuccess(combo , 'Update Combo Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/combo/delete:
      *   get:
      *     tags:
      *       - AdminCombo
      *     summary: Delete Categories Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete  Package
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete Combo
      */
      async delete ({request, response }) {
            var data = request.all()
            const combo = await Combo.find(data.id)
            if (!combo) {
                  return response.respondWithError('Not found id combo!')
            }
            combo.delete()
            return response.respondWithSuccess([] , 'Delete Combo Successful!')
      }
}
module.exports = ComboController
