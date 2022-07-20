'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const Customer = use('App/Models/Customer')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
const { validate } = use('Validator')
const Hash = use('Hash')
const speakeasy = require('speakeasy')
const Helpers = use('Helpers')
const HelperLibrary = use('App/Libraries/Helpers')
const {
  getCurrentCustomer , 
  getChildCustomerTree , 
  showTreeChildrenCustomer
} = use('App/Libraries/TraitsHelpers')

const collect = require('collect.js')
class CustomerController {
      /**
      * @swagger
      * /api/v1/admin/customer/list:
      *   get:
      *     tags:
      *       - AdminCustomer
      *     summary: List Customer
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Customer
      */
      async list ({request, response }) {
            var data = request.all()
            const customers = await Customer.query().with('levelInfoCommissions').with('sponsor').fetch()
            return response.respondWithSuccess(customers , 'List Customer Successful!')
      }
      /**
       * @swagger
       * /api/v1/admin/customer/create:
       *   post:
       *     tags:
       *       - AdminCustomer
       *     summary: Create Customer Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Create Customer Admin
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
       *       - name: gender
       *         description: Gender
       *         in: query
       *         required: false
       *         type: string
       *         example : "male"
       *         
       *       - name: passport
       *         description: Passport
       *         in: query
       *         required: false
       *         type: string
       *         example : "3322445566"
       *         
       *       - name: sponsor_id
       *         description: sponsor_id
       *         in: query
       *         required: false
       *         type: string
       *         example : 1
       *       - name: level_commissions
       *         description: "SelectBox form 1 -> 5"
       *         in: query
       *         required: false
       *         type: string
       *         example : 1
       *     responses:
       *       200:
       *         description: Create Customer Admin
       */
      async create ({request, response }) {
            var data = request.all()
            const product = new Customer()
            const {createWallet} = use('App/Libraries/Ethereum')
            var results = await createWallet()
            const rules = {
                  first_name: 'required',
                  last_name: 'required',
                  username: 'required|unique:customers,username',
                  email: 'required|email|unique:customers,email',
                  password: 'required'
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed!', validation.messages())
            }
            const profilePic = request.file('image', {
                types: ['image'],
                size: '2mb'
            })
            if (profilePic != null) {
                  await profilePic.move(Helpers.publicPath('uploads/customers'), {
                      name: `${data.username}${new Date().getTime()}.${profilePic.subtype}`,
                      overwrite: true
                  })

                  if (!profilePic.moved()) {
                      return response.respondWithError('Validation is failed', profilePic.error())
                  }
            }
            const trx = await Database.beginTransaction()
            const customer = new Customer()
            customer.first_name   = data.first_name
            customer.last_name    = data.last_name
            customer.email        = data.email
            customer.username     = data.username.trim()
            customer.password     = await Hash.make(data.password)
            customer.sponsorKey   = HelperLibrary.generateKeySponsor()
            customer.sponsor_id   = data.sponsor_id
            customer.customer_code = HelperLibrary.customerCode()
            customer.phone_number = data.phone_number
            customer.country      = data.country
            customer.province     = data.province
            customer.address      = data.address
            customer.gender       = data.gender
            customer.passport     = data.passport
            customer.wallet_address     = results.address
            customer.wallet_private_key = results.privateKey
            customer.level_commissions  = results.level_commissions
            customer.is_active    = 1
            customer.tow_factor_auth    = speakeasy.generateSecret({length: 20}).base32
            if (profilePic != null) {
                  customer.image = '/uploads/customers/' + profilePic.fileName
            }
            await customer.save(trx)
            trx.commit()
            return response.respondWithSuccess(customer , 'Add Customer Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/customer/edit:
      *   get:
      *     tags:
      *       - AdminCustomer
      *     summary: Edit Customer
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Customer
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Customer
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const customer = await Customer.find(data.id)
            if (!customer) {
                  return response.respondWithError('Not found id Customer!')
            }
            return response.respondWithSuccess(customer , 'Get Id Customer Successful!')
      }
      /**
       * @swagger
       * /api/v1/admin/customer/update:
       *   post:
       *     tags:
       *       - AdminCustomer
       *     summary: Update Customer Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Update Customer Admin
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
       *       - name: gender
       *         description: Gender
       *         in: query
       *         required: false
       *         type: string
       *         example : "male"
       *         
       *       - name: passport
       *         description: Passport
       *         in: query
       *         required: false
       *         type: string
       *         example : "3322445566"

       *       - name: sponsor_id
       *         description: sponsor_id
       *         in: query
       *         required: false
       *         type: string
       *         example : 1
       *       - name: level_commissions
       *         description: "SelectBox form 1 -> 5"
       *         in: query
       *         required: false
       *         type: string
       *         example : 1
       *     responses:
       *       200:
       *         description: Create User Admin
       */
      async update ({request, response }) {
            var data = request.all()
            const customer = await Customer.find(data.id)
            if (!customer) {
                  return response.respondWithError('Not found id Customer!')
            }
            const {createWallet} = use('App/Libraries/Ethereum')
            var results = await createWallet()
            const rules = {
                  first_name: 'required',
                  last_name: 'required',
                  username: 'required|unique:customers,username,id,' + customer.id,
                  email: 'required|email|unique:customers,email,id,' + customer.id,
            }
            const validation = await validate(data, rules)
            if (validation.fails()) {
                 return response.respondWithError('Validation is failed!', validation.messages())
            }
            const profilePic = request.file('image', {
                types: ['image'],
                size: '2mb'
            })
            if (profilePic != null) {
                  if (customer.image != null) {
                        const fs = await require('fs')
                        if (fs.existsSync(Helpers.publicPath(customer.image))) {
                            fs.unlinkSync(Helpers.publicPath(customer.image))
                        }
                  }
                  await profilePic.move(Helpers.publicPath('uploads/customers'), {
                      name: `${data.username}${new Date().getTime()}.${profilePic.subtype}`,
                      overwrite: true
                  }) 
                  if (!profilePic.moved()) {
                      return response.respondWithError('Validation is failed', profilePic.error())
                  }
            }
            if (data.sponsor_id == data.id) {
                  return response.respondWithError('Sponsor Id is wrong!')
            }
            const trx = await Database.beginTransaction()
            customer.first_name   = data.first_name
            customer.last_name    = data.last_name
            customer.email        = data.email
            customer.username     = data.username.trim()
            if (data.password != null ) {
                  customer.password = await Hash.make(data.password)
            }
            customer.phone_number = data.phone_number
            customer.country      = data.country
            customer.province     = data.province
            customer.address      = data.address
            customer.gender       = data.gender
            customer.wallet_address     = results.address
            customer.wallet_private_key = results.privateKey
            customer.passport     = data.passport
            customer.sponsor_id   = data.sponsor_id
            customer.level_commissions = data.level_commissions
            customer.is_active    = 1
            customer.tow_factor_auth    = speakeasy.generateSecret({length: 20}).base32
            if (profilePic != null) {
                customer.image = '/uploads/customers/' + profilePic.fileName
            }
            await customer.save(trx)
            trx.commit()
            const customerData = await Customer.query()
                  .with('levelInfoCommissions')
                  .with('sponsor')
                  .where('id',customer.id)
                  .first()
            return response.respondWithSuccess(customerData , 'Update Customer Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/customer/show-detail:
      *   get:
      *     tags:
      *       - AdminCustomer
      *     summary: Show Detail
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Show Detail Customer
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Show Detail
      */
      async delete ({request, response }) {
            var data = request.all()
            const customer = await Customer.find(data.id)
            if (!customer) {
                  return response.respondWithError('Not found id Customer!')
            }
            if (customer.image != null) {
                  const fs = await require('fs')
                  if (fs.existsSync(Helpers.publicPath(customer.image))) {
                      fs.unlink(Helpers.publicPath(customer.image))
                  }
            }
            customer.delete()
            return response.respondWithSuccess([] , 'Delete Customer Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/customer/delete:
      *   get:
      *     tags:
      *       - AdminCustomer
      *     summary: Delete User Admin
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Delete Customer
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Delete Customer
      */
      async showDetail ({request, response }) {
            var data = request.all()
            const customer = await Customer.query().with('levelInfoCommissions').where('id',data.id).first()
            if (!customer) {
                  return response.respondWithError('Not found id Customer!')
            }
            return response.respondWithSuccess(customer , 'Delete Customer Successful!')
      }

      /**
         * @swagger
         * /api/v1/admin/customer/ref-tree:
         *   get:
         *     tags:
         *       - AdminCustomer
         *     summary: Ref Tree User
         *     description: Ref Tree User
         *     security:
         *       - Bearer: []
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: The request has succeeded.
         */
      async refInfoUser ({request, response }){
            var data = request.all()
            const customers = await Customer.query().with('levelInfoCommissions').select('*').fetch()
            var objCustomers  = customers.toJSON()
            var sponsor_id = 0 , level = 0
            const arrLevelCustomers = showTreeChildrenCustomer(objCustomers , sponsor_id , level)
            const collection = collect(arrLevelCustomers)
            const sorted = collection.sortBy((product, key) => product.id)
            const objects = sorted.all()
            return response.respondWithSuccess(customers,'List Ref successfull!')
      }

      async generate({request, response }){
            const customers = await Customer.query().select('*').fetch()
            const customersJSON = customers.toJSON()
            for (var i = 0; i < customersJSON.length; i++) {
                  const user = customersJSON[i]
                  console.log(user)
                  const customer = await Customer.find(user.id)
                  customer.customer_code = HelperLibrary.customerCode();
                  await customer.save();
            }
            return  response.respondWithSuccess([], 'Update Code OK!')
      }
      /**
      * @swagger
      * /api/v1/admin/customer/update-active:
      *   post:
      *     tags:
      *       - AdminCustomer
      *     summary: Update Active
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: info
      *         description: 0 deactive , 1 active
      *         in:  body
      *         required: true
      *         type: string
      *         schema:
      *           example : {
      *              id : 1,
      *              is_active : 1,
      *           }
      *     responses:
      *       200:
      *         description: Show Detail
      */
      async updateActive ({request, response }) {
            var data = request.all()
            const customer = await Customer.find(data.id)
            if (!customer) {
                  return response.respondWithError('Not found id Customer!')
            }
            customer.is_active = data.is_active
            customer.save()
            return response.respondWithSuccess(customer , 'Delete Customer Successful!')
      }
}
module.exports = CustomerController
