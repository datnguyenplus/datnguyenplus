'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Permission = use('App/Models/Permission')
class PermissionController {
      /**
      * @swagger
      * /api/v1/admin/permission/list:
      *   get:
      *     tags:
      *       - AdminPermission
      *     summary: List Permission Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List Permission Admin
      */
      async list ({request, response }) {
            var data = request.all()
            const permissions = await Permission.all()
            return response.respondWithSuccess(permissions , 'List Permission Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/permission/group-list:
      *   get:
      *     tags:
      *       - AdminPermission
      *     summary: List Permission Group list Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: group_id
      *         description: List Permission Group list Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: List Permission Group list Admin
      */
      async groupList ({request, response }) {
            var data = request.all()
            const permissions = await Permission.query().where('permission_group_id',data.group_id).fetch()
            return response.respondWithSuccess(permissions , 'List Group Permission Successful!')
      }
     /**
       * swagger
       * /api/v1/admin/permission/create:
       *   post:
       *     tags:
       *       - AdminPermission
       *     summary: Create Permission Admin
       *     description: Create Permission Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create Permission Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PermissionCreate'
       *     responses:
       *       200:
       *         description: Create Permission Admin
       */
      async create ({request, response }) {
            var data = request.all()
            const permission = new Permission();
            permission.name = data.name
            permission.display_name = data.display_name
            permission.permission_group_id = data.permission_group_id
            permission.description = data.description
            await permission.save()
            return response.respondWithSuccess(permission , 'Add Permission Successful!')
      }

      /**
      * swagger
      * /api/v1/admin/permission/edit:
      *   get:
      *     tags:
      *       - AdminPermission
      *     summary: Edit Permission Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Permission Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Permission Admin
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const permission = await Permission.find(data.id)
            return response.respondWithSuccess(permission , 'Get Id Permission Successful!')
      }

      /**
       * swagger
       * /api/v1/admin/permission/update:
       *   post:
       *     tags:
       *       - AdminPermission
       *     summary: Update Permission Admin
       *     description: Update Permission Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Permission Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PermissionUpdate'
       *     responses:
       *       200:
       *         description: Update Permission Admin
       */
      async update ({params , request, response }) {
            var data = request.all()
            const permission = await Permission.find(data.id);
            permission.name = data.name
            permission.display_name = data.display_name
            permission.permission_group_id = data.permission_group_id
            permission.description = data.description
            permission.save()
            return response.respondWithSuccess(permission , 'Update Permission Successful!')
      }

      /**
      * swagger
      * /api/v1/admin/permission/delete:
      *   get:
      *     tags:
      *       - AdminPermission
      *     summary: Delete Permission Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete Permission Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete Permission Admin
      */
      async delete ({request, response }) {
            var data = request.all()
            const permission = await Permission.find(data.id)
            permission.delete()
            return response.respondWithSuccess(permission , 'Delete Permission Successful!')
      }
}
module.exports = PermissionController
