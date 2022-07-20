'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const PermissionGroup = use('App/Models/PermissionGroup')
class GroupController {
      /**
      * @swagger
      * /api/v1/admin/group/list:
      *   get:
      *     tags:
      *       - AdminPermissionGroup
      *     summary: List Group Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List Group Admin
      */
      async list ({request, response }) {
            var data = request.all()
            const groups = await PermissionGroup.all()
            return response.respondWithSuccess(groups , 'List Group Successful!')
      }
     /**
       * swagger
       * /api/v1/admin/group/create:
       *   post:
       *     tags:
       *       - AdminPermissionGroup
       *     summary: Create Group Admin
       *     description: Create Group Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create Group Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PermissionGroupCreate'
       *     responses:
       *       200:
       *         description: Create Group Admin
       */
	async create ({request, response }) {
            var data = request.all()
            const group = new PermissionGroup();
            group.name = data.name
            group.description = data.description
            await group.save()
            return response.respondWithSuccess(group , 'Add Group Successful!')
	}

      /**
      * @swagger
      * /api/v1/admin/group/edit:
      *   get:
      *     tags:
      *       - AdminPermissionGroup
      *     summary: Edit Group Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Group Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Group Admin
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const group = await PermissionGroup.find(data.id)
            return response.respondWithSuccess(group , 'Get Id Group Successful!')
      }

      /**
       * swagger
       * /api/v1/admin/group/update:
       *   post:
       *     tags:
       *       - AdminPermissionGroup
       *     summary: Update Group Admin
       *     description: Update Group Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Group Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PermissionGroupUpdate'
       *     responses:
       *       200:
       *         description: Update Group Admin
       */
      async update ({request, response }) {
            var data = request.all()
            const group = await PermissionGroup.find(data.id)
            group.name = data.name
            group.description = data.description
            group.save()
            return response.respondWithSuccess(group , 'Update Group Successful!')

      }

      /**
      * swagger
      * /api/v1/admin/group/delete:
      *   get:
      *     tags:
      *       - AdminPermissionGroup
      *     summary: Delete Group Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete Group Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete Group Admin
      */
      async delete ({request, response }) {
            var data = request.all()
            const group = await PermissionGroup.find(data.id)
            group.delete()
            return response.respondWithSuccess([] , 'Delete Group Successful!')
      }
}
module.exports = GroupController
