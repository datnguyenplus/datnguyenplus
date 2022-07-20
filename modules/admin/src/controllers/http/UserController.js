'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const User = use('App/Models/User')
const Database = use('Database')
const Hash = use('Hash')
const MessageCode = use('App/Libraries/MessageCode')
const PermissionRole = use('App/Models/PermissionRole')
const { validate } = use('Validator')
const RoleUser = use('App/Models/RoleUser')
const Permission = use('App/Models/Permission')
const {RolePermissions} = use('App/Libraries/PermissionHelpers')
const Helpers = use('Helpers')
const cmsHelpers = use('App/Libraries/Helpers')
class UserController {

      /**
      * @swagger
      * /api/v1/admin/user/list:
      *   get:
      *     tags:
      *       - AdminUser
      *     summary: List User Admin
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: List User Admin
      */
      async list ({request, response }) {
            var data = request.all()
            const users = await User.query().fetch()
            var obj = users.toJSON()
            var permissionCurentUsers = []
            for(let i = 0; i < obj.length; i++){
                  const rolePermistions = await RolePermissions(obj[i])
                  permissionCurentUsers[i] = rolePermistions
            }
            return response.respondWithSuccess(permissionCurentUsers , 'List User Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/user/create:
       *   post:
       *     tags:
       *       - AdminUser
       *     summary: Create User Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Create User Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: formData
       *         name: image
       *         type: file
       *         description: The file to upload.
       *         
       *       - name: username
       *         description: Username
       *         in: query
       *         required: true
       *         type: string
       *         example : "icarebase"
       *         
       *       - name: first_name
       *         description: First Name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Dat"
       *         
       *       - name: last_name
       *         description: Last Name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Nguyen"
       *         
       *       - name: phone_number
       *         description: Phone Number
       *         in: query
       *         required: true
       *         type: string
       *         example : "0388912345"
       *
       *       - name: email
       *         description: Email
       *         in: query
       *         required: true
       *         type: string
       *         example : "nguyentandat43+1@gmail.com"
       *         
       *       - name: password
       *         description: Password
       *         in: query
       *         required: true
       *         type: string
       *         example : "123456"
       *         writeOnly : true
       *         
       *       - name: country
       *         description: "Country"
       *         in: query
       *         required: false
       *         type: string
       *         example : "Vietnam"
       *
       *       - name: province
       *         description: "Province"
       *         in: query
       *         required: false
       *         type: string
       *         example : "TP. Ho Chi Minh"
       *         
       *       - name: address
       *         description: "Address"
       *         in: query
       *         required: false
       *         type: string
       *         example : "12/2 , Bình Thạnh"
       *
       *       - name: passport
       *         description: Passport
       *         in: query
       *         required: false
       *         type: string
       *         example : "3322445566"
       *         
       *       - name: role_id
       *         description: "Role"
       *         in: query
       *         required: true
       *         type: integer
       *         example : 1
       *         
       *     responses:
       *       200:
       *         description: Create User Admin
       */
       async create ({request, response }) {
            var data = request.all()
            const rules = {
                  first_name: 'required',
                  username : 'required',
                  last_name: 'required',
                  email: 'required|email|unique:users,email',
                  username: 'required|unique:users,username',
                  password: 'required',
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed', validation.messages())
            }
            const profilePic = request.file('image', {
                types: ['image'],
                size: '2mb'
            })
            if (profilePic != null) {
                  await profilePic.move(Helpers.publicPath('uploads/users'), {
                      name: `${data.username}${new Date().getTime()}.${profilePic.subtype}`,
                      overwrite: true
                  })

                  if (!profilePic.moved()) {
                      return response.respondWithError('Validation is failed', profilePic.error())
                  }
            }
            const user = new User();
            user.first_name = data.first_name
            user.last_name = data.last_name
            user.phone_number = data.phone_number
            user.email = data.email
            user.username = data.username
            user.password = await Hash.make(data.password)
            user.country = data.country
            user.province = data.province
            user.address = data.address
            user.passport = data.passport
            if (profilePic != null) {
                  user.image = '/uploads/users/' + profilePic.fileName
            }
            await user.save()
            user.roles().attach(data.role_id)
            return response.respondWithSuccess(user , 'Create User Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/user/edit:
      *   get:
      *     tags:
      *       - AdminUser
      *     summary: Edit User Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit User Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit User Admin
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const user = await User.find(data.id)
            if (!user) {
                 return response.respondWithError('Can not found user id!') 
            }
            const roleUser = await RoleUser.query().where('user_id',user.id).first()
            user.role_id = (roleUser) ? roleUser.id : ''
            return response.respondWithSuccess(user , 'Get ID User Successful!')
      }
      /**
       * @swagger
       * /api/v1/admin/user/update:
       *   post:
       *     tags:
       *       - AdminUser
       *     summary: Update User Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Update User Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: query
       *         name: id
       *         type: integer
       *         description: Id.
       *         example : 6
       *       - in: formData
       *         name: image
       *         type: file
       *         description: The file to upload.
       *         
       *       - name: username
       *         description: Username
       *         in: query
       *         required: true
       *         type: string
       *         example : "icarebase"
       *         
       *       - name: first_name
       *         description: First Name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Dat"
       *         
       *       - name: last_name
       *         description: Last Name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Nguyen"
       *         
       *       - name: phone_number
       *         description: Phone Number
       *         in: query
       *         required: true
       *         type: string
       *         example : "0388912345"
       *
       *       - name: email
       *         description: Email
       *         in: query
       *         required: true
       *         type: string
       *         example : "nguyentandat43+1@gmail.com"
       *         
       *       - name: password
       *         description: Password
       *         in: query
       *         required: false
       *         type: string
       *         example : "123456"
       *         writeOnly : true
       *         
       *       - name: country
       *         description: "Country"
       *         in: query
       *         required: false
       *         type: string
       *         example : "Vietnam"
       *
       *       - name: province
       *         description: "Province"
       *         in: query
       *         required: false
       *         type: string
       *         example : "TP. Ho Chi Minh"
       *         
       *       - name: address
       *         description: "Address"
       *         in: query
       *         required: false
       *         type: string
       *         example : "12/2 , Bình Thạnh"
       *
       *       - name: passport
       *         description: Passport
       *         in: query
       *         required: false
       *         type: string
       *         example : "3322445566"
       *         
       *       - name: role_id
       *         description: "Role"
       *         in: query
       *         required: true
       *         type: integer
       *         example : 1
       *         
       *     responses:
       *       200:
       *         description: Create User Admin
       */

       async update ({request, response }) {
            var data = request.all()
            const rules = {
                  first_name: 'required',
                  last_name: 'required',
                  email: 'required|email|unique:users,email,id,'+data.id,
                  username: 'required|unique:users,username,id,'+data.id,
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed', validation.messages())
            }
            const user = await User.find(data.id)
            if (!user) {
                 return response.respondWithError('Can not found user id!') 
            }
            const profilePic = request.file('image', {
                types: ['image'],
                size: '2mb'
            })
            if (profilePic != null) {
                  if (user.image != null) {
                        const fs = await require('fs')
                        if (fs.existsSync(Helpers.publicPath(user.image))) {
                            fs.unlink(Helpers.publicPath(user.image))
                        }
                  }
                  await profilePic.move(Helpers.publicPath('uploads/users'), {
                      name: `${data.username}${new Date().getTime()}.${profilePic.subtype}`,
                      overwrite: true
                  }) 
                  if (!profilePic.moved()) {
                      return response.respondWithError('Validation is failed', profilePic.error())
                  }
            }
            
            await user.roles().detach()
            user.first_name = data.first_name
            user.last_name = data.last_name
            user.phone_number = data.phone_number
            user.email = data.email
            user.username = data.username
            if (data.password != null ) {
                  user.password = await Hash.make(data.password)
            }
            user.country = data.country
            user.province = data.province
            user.address = data.address
            user.passport = data.passport
            if (profilePic != null) {
                user.image = '/uploads/users/' + profilePic.fileName
            }
            user.save()
            user.roles().attach(data.role_id)
            return response.respondWithSuccess(user , 'Update User Successful!')

      }

      /**
      * @swagger
      * /api/v1/admin/user/delete:
      *   get:
      *     tags:
      *       - AdminUser
      *     summary: Delete User Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete User Admin
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete User Admin
      */
      async delete ({request, response }) {
            var data = request.all()
            const user = await User.find(data.id)
            if (!user) {
                 return response.respondWithError('Can not found user id!') 
            }
            if (user.image != null) {
                  const fs = await require('fs')
                  if (fs.existsSync(Helpers.publicPath(user.image))) {
                      fs.unlink(Helpers.publicPath(user.image))
                  }
            }
            user.delete()
            await user.roles().detach()
            return response.respondWithSuccess([] , 'Delete Role Successful!')
      }
}
module.exports = UserController
