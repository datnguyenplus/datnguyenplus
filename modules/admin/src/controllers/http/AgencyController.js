'use strict'

const Env = use('Env')
const Mail = use('Mail')
const path = require('path')
const Agency = use('App/Models/Agency')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
const { validate } = use('Validator')
const Hash = use('Hash')
const speakeasy = require('speakeasy')
const Helpers = use('Helpers')
const HelperLibraries = use('App/Libraries/Helpers')
class AgencyController {
	/**
  	* @swagger
  	* /api/v1/admin/agency/list:
  	*   get:
  	*     tags:
  	*       - AdminAgency
  	*     summary: List Agency
  	*     security:
  	*       - Bearer: []
  	*     responses:
  	*       200:
  	*         description: Agency List
  	*/
  	async list ({request, response }) {
        var data = request.all()
        const agency = await Agency.all()
        return response.respondWithSuccess(agency , 'List Agency Successful!')
  	}
  	/**
       * @swagger
       * /api/v1/admin/agency/create:
       *   post:
       *     tags:
       *       - AdminAgency
       *     summary: Create Agency Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Create Agency Admin
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
       *       - name: agency_name
       *         description: Agency name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Tuoi Tre Software"

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
       *         example : "agency@gmail.com"
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
       *       - name: tax_code
       *         description: "Mã số thuế"
       *         in: query
       *         required: false
       *         type: string
       *         example : "TT23132132123133"
       *         
       *     responses:
       *       200:
       *         description: Create Agency Admin
       */
    async create ({request, response }) {
      	var data = request.all()
        const product = new Agency()
        const rules = {
            agency_name: 'required',
            phone_number: 'required',
            tax_code: 'required|unique:agency,tax_code',
            email: 'required|email|unique:agency,email',
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
              await profilePic.move(Helpers.publicPath('uploads/agency'), {
                  name: `${HelperLibraries.strString(data.agency_name)}${new Date().getTime()}.${profilePic.subtype}`,
                  overwrite: true
              })

              if (!profilePic.moved()) {
                  return response.respondWithError('Validation is failed', profilePic.error())
              }
        }
        const trx = await Database.beginTransaction()
        const agency = new Agency()
        agency.agency_name   	= data.agency_name
        agency.email        	= data.email
        agency.phone_number 	= data.phone_number
        agency.country      	= data.country
        agency.province     	= data.province
        agency.address      	= data.address
        agency.tax_code      	= data.tax_code
        if (profilePic != null) {
              agency.image 	= '/uploads/agency/' + profilePic.fileName
        }
        await agency.save(trx)
        trx.commit()
        return response.respondWithSuccess(agency , 'Add Customer Successful!')
    }

      /**
      * @swagger
      * /api/v1/admin/agency/edit:
      *   get:
      *     tags:
      *       - AdminAgency
      *     summary: Edit Agency
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Agency
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Agency
      */
      	async edit ({params , request, response }) {
            var data = request.all()
            const agency = await Agency.find(data.id)
            if (!agency) {
                  return response.respondWithError('Not found id Agency!')
            }
            return response.respondWithSuccess(agency , 'Get Id Agency Successful!')
      	}
    /**
       * @swagger
       * /api/v1/admin/agency/update:
       *   post:
       *     tags:
       *       - AdminAgency
       *     summary: Update Agency Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Update Agency Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: query
       *         name: id
       *         type: integer
       *         description: Id.
       *         example : 1
       *         
       *       - in: formData
       *         name: image
       *         type: file
       *         description: The file to upload.
       *         
       *       - name: agency_name
       *         description: Agency name
       *         in: query
       *         required: true
       *         type: string
       *         example : "Tuoi Tre Software"

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
       *         example : "agency@gmail.com"
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
       *       - name: tax_code
       *         description: "Mã số thuế"
       *         in: query
       *         required: false
       *         type: string
       *         example : "TT23132132123133"
       *         
       *     responses:
       *       200:
       *         description: Update Agency Sucessfull!
       */
  	async update ({request, response }) {
  		var data = request.all()
        const agency = await Agency.find(data.id)
        const rules = {
            agency_name: 'required',
            phone_number: 'required',
            tax_code: 'required|unique:agency,tax_code,id,' + agency.id,
            email: 'required|email|unique:agency,email,id,' + agency.id,
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
              if (agency.image != null) {
                    const fs = await require('fs')
                    if (fs.existsSync(Helpers.publicPath(agency.image))) {
                        fs.unlinkSync(Helpers.publicPath(agency.image))
                    }
              }
              await profilePic.move(Helpers.publicPath('uploads/agency'), {
                  name: `${HelperLibraries.strString(data.agency_name)}${new Date().getTime()}.${profilePic.subtype}`,
                  overwrite: true
              }) 
              if (!profilePic.moved()) {
                  return response.respondWithError('Validation is failed', profilePic.error())
              }
        }
        const trx = await Database.beginTransaction()
        agency.agency_name   	= data.agency_name
        agency.email        	= data.email
        agency.phone_number 	= data.phone_number
        agency.country      	= data.country
        agency.province     	= data.province
        agency.address      	= data.address
        agency.tax_code      	= data.tax_code
        if (profilePic != null) {
            agency.image = '/uploads/agency/' + profilePic.fileName
        }
        await agency.save(trx)
        trx.commit()
        return response.respondWithSuccess(agency , 'Update Customer Successful!')
  	}


      	/**
	      * @swagger
	      * /api/v1/admin/agency/delete:
	      *   get:
	      *     tags:
	      *       - AdminAgency
	      *     summary: Delete 
	      *     security:
	      *       - Bearer: []
	      *     parameters:
	      *       - name: id
	      *         description: ""
	      *         in: query
	      *         required: true
	      *         type: string
	      *     responses:
	      *       200:
	      *         description: Delete successfull!
	      */
      	async delete ({request, response }) {
            var data = request.all()
            const agency = await Agency.find(data.id)
            if (!agency) {
                  return response.respondWithError('Not found id Agency!')
            }
            if (agency.image != null) {
                  const fs = await require('fs')
                  if (fs.existsSync(Helpers.publicPath(agency.image))) {
                      fs.unlink(Helpers.publicPath(agency.image))
                  }
            }
            agency.delete()
            return response.respondWithSuccess([] , 'Delete Customer Agency!')
      	}
}
module.exports = AgencyController
