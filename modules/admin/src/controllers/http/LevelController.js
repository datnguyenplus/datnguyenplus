'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Level = use('App/Models/Level')
const MessageCode = use('App/Libraries/MessageCode')
const Helpers = use('App/Libraries/Helpers')
const { validate } = use('Validator')
const Combo = use('App/Models/Combo')
const Package = use('App/Models/Package')
class LevelController {
      /**
      * @swagger
      * /api/v1/admin/level/list:
      *   get:
      *     tags:
      *       - AdminLevel
      *     summary: List level
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Server is OK!
      */
      async list ({request, response }) {
            var data = request.all()
            const level = await Level.all()
            return response.respondWithSuccess(level , 'List level Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/level/create:
       *   post:
       *     tags:
       *       - AdminLevel
       *     summary: Create level
       *     security:
       *       - Bearer: []
       *     description: Create level
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create level
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/LevelCreate'
       *     responses:
       *       200:
       *         description: Server is OK!
       */
      async create ({request, response }) {
            var data = request.all()
            const rules = {
                  level: 'required|unique:levels,level',
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed!', validation.messages())
            }
            const level = new Level()
            level.level = data.level
            level.title = data.title
            level.color = data.color
            await level.save()
            return response.respondWithSuccess(level , 'Add level Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/level/edit:
      *   get:
      *     tags:
      *       - AdminLevel
      *     summary: Edit level
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Level
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit level
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const level = await Level.find(data.id)
            if (!level) {
                  return response.respondWithError('Not found id category!')
            }
            return response.respondWithSuccess(level , 'Get Id level Successful!')
      }

      /**
       * @swagger
       * /api/v1/admin/level/update:
       *   post:
       *     tags:
       *       - AdminLevel
       *     summary: Update level
       *     description: Update Level
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Level
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/LevelUpdate'
       *     responses:
       *       200:
       *         description: Server is OK!
       */
      async update ({request, response }) {
            var data = request.all()
            const level = await Level.find(data.id)
            const rules = {
                  level: 'required|unique:levels,level,id,' + level.id,
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed!', validation.messages())
            }
            level.level = data.level
            level.title = data.title
            level.color = data.color
            level.save()
            return response.respondWithSuccess(level , 'Update level Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/level/delete:
      *   get:
      *     tags:
      *       - AdminLevel
      *     summary: Delete level
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete level
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete level
      */
      async delete ({request, response }) {
            var data = request.all()
            const level = await Level.find(data.id)
            if (!level) {
                  return response.respondWithError('Not found id level!')
            }
            level.delete()
            return response.respondWithSuccess([] , 'Delete level Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/update/position:
      *   post:
      *     tags:
      *       - AdminPackage
      *     summary: Update package
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: info
      *         description: Update position
      *         in:  body
      *         required: true
      *         type: string
      *         schema:
      *           example : {
      *              type : 'package',
      *              idCurrent : 1,
      *              indexCurrent : 1,
      *              idTarget : 3,
      *              indexTarget : 2,
      *           }
      *     responses:
      *       200:
      *         description: Update package
      *       500:
      *         description: Server is OK!
      */
      async updatePosition ({request, response }) {
            var data = request.all()
            if(data.type == 'package'){
                  const product1 = await Package.find(data.idCurrent)
                  if (!product1) {
                        return response.respondWithError('The id package not found!')
                  }
                  product1.position = data.indexTarget
                  product1.save()

                  const product2 = await Package.find(data.idTarget)
                  if (!product2) {
                        return response.respondWithError('The id package not found!')
                  }
                  product2.position = data.indexCurrent
                  product2.save()
                  return response.respondWithSuccess([] , 'Update Position Package Successful!')

            }else{
                  const combo1 = await Combo.find(data.idCurrent)
                  if (!combo1) {
                        return response.respondWithError('The id package not found!')
                  }
                  combo1.position = data.indexTarget
                  combo1.save()

                  const combo2 = await Combo.find(data.idTarget)
                  if (!combo2) {
                        return response.respondWithError('The id package not found!')
                  }
                  combo2.position = data.indexCurrent
                  combo2.save()
                  return response.respondWithSuccess([] , 'Update Position Combo Successful!')
            }
      }
}
module.exports = LevelController
