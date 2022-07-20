'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Role = use('App/Models/Role')
const PermissionRole = use('App/Models/PermissionRole')
const Database = use('Database')
const Hash = use('Hash')
const MessageCode = use('App/Libraries/MessageCode')
class RoleController {
      /**
      * @swagger
      * /api/v1/admin/role/list:
      *   get:
      *     tags:
      *       - AdminRole
      *     summary: List Role Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List Role Admin
      */
      async list ({request, response }) {
            var data = request.all()
            const roles = await Role.query().with('permissions').fetch()
            return response.respondWithSuccess(roles , 'List Roles Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/role/create:
       *   post:
       *     tags:
       *       - AdminRole
       *     summary: Create Role Admin
       *     description: Create Role Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create Role Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/RoleCreate'
       *     responses:
       *       200:
       *         description: Create Role Admin
       */
      async create ({request, response }) {
            var data = request.all()
            const role = new Role()
            role.name = data.name
            role.description = data.description
            await role.save()
            role.permissions().attach(data.permissions)
            return response.respondWithSuccess(role , 'Create New Role Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/role/edit:
      *   get:
      *     tags:
      *       - AdminRole
      *     summary: Edit Role Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Role Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Role Admin
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const role = await Role.find(data.id)
            var permissionCurrently = []
            const permissionRole = await PermissionRole.query().where('role_id',role.id).fetch()
            var obj = permissionRole.toJSON()
            for(let i = 0; i < obj.length; i++){
                  permissionCurrently.push(obj[i].permission_id)
            }
            role.permissions = permissionCurrently
            return response.respondWithSuccess(role , 'Get ID Role Successful!')
      }

      /**
       * @swagger
       * /api/v1/admin/role/update:
       *   post:
       *     tags:
       *       - AdminRole
       *     summary: Update Role Admin
       *     security:
       *       - Bearer: []
       *     description: Update Role Admin
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Role Admin
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/RoleUpdate'
       *     responses:
       *       200:
       *         description: Update Role Admin
       */
      async update ({request, response }) {
            var data = request.all()
            const role = await Role.find(data.id)
            if (!role) {
                 return response.respondWithError('Can not found role id!') 
            }
            await role.permissions().detach()
            role.name = data.name
            role.description = data.description
            role.save()
            role.permissions().attach(data.permissions)
            const roleResponse = role
            return response.respondWithSuccess(roleResponse , 'Update Role Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/role/delete:
      *   get:
      *     tags:
      *       - AdminRole
      *     summary: Delete Role Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete Role Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete Role Admin
      */
      async delete ({request, response }) {
            var data = request.all()
            const role = await Role.find(data.id)
            if (!role) {
                 return response.respondWithError('Can not found role id!') 
            }
            role.delete()
            await role.permissions().detach()
            return response.respondWithSuccess([] , 'Delete Role Successful!')
      }
}
module.exports = RoleController
