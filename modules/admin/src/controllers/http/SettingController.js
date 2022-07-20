'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Setting = use('App/Models/Setting')
const MessageCode = use('App/Libraries/MessageCode')
const Helpers = use('App/Libraries/Helpers')
const Database = use('Database')
class SettingController {

      /**
      * @swagger
      * /api/v1/admin/setting/list:
      *   get:
      *     tags:
      *       - AdminSetting
      *     summary: Edit Setting Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Edit Setting Admin
      */
      async list ({params , request, response }) {
            var data = request.all()
            const settings = await Setting.query().where('user_type','admin').fetch()
            var obj = Helpers.converJsonSetting(settings.toJSON())
            return response.respondWithSuccess(obj , 'List Setting Successful!')
      }


      /**
      * @swagger
      * /api/v1/admin/setting/find-key:
      *   get:
      *     tags:
      *       - AdminSetting
      *     summary: Find key Setting Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: key
      *         description: Find key Setting Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Find key Setting Admin
      */
      async findKey ({params , request, response }) {
            var data = request.all()
            var obj = {}
            const setting = await Setting.query().where('skey',data.key).first()
            obj[setting.skey] = setting.value
            return response.respondWithSuccess(obj , 'Get Key Setting Successful!')
      }

      /**
       * @swagger
       * /api/v1/admin/setting/update:
       *   post:
       *     tags:
       *       - AdminSetting
       *     summary: Update Setting Admin
       *     description: Update Setting Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Setting Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/SettingUpdate'
       *     responses:
       *       200:
       *         description: Update Setting Admin
       */
      async update ({request, response }) {
            var data = request.all()
            var settings = request.input('settings')
            const trx = await Database.beginTransaction()
            const setting = await Setting.query().where('type',data.type).delete()
            for (var key in settings) {
                  const settingCreate = new Setting()
                  settingCreate.type = data.type
                  settingCreate.skey = key
                  settingCreate.value = settings[key]
                  settingCreate.user_type = 'admin'
                  await settingCreate.save(trx)  
            }
            trx.commit()
            const updateSettings = await Setting.query().fetch()
            var obj = Helpers.converJsonSetting(updateSettings.toJSON())
            return response.respondWithSuccess(obj , 'Update Setting Successful!')

      }

      /**
      * @swagger
      * /api/v1/admin/setting/info:
      *   get:
      *     tags:
      *       - AdminSetting
      *     summary: Get List Setting Not Token
      *     responses:
      *       200:
      *         description: Server is OK!
      */
      async info ({params , request, response }) {
            var data = request.all()
            const settings = await Setting.query().where('user_type','admin').fetch()
            var obj = Helpers.converJsonSetting(settings.toJSON())
            return response.respondWithSuccess(obj , 'List Setting Successful!')
      }
}
module.exports = SettingController
