'use strict'

const Env = use('Env')
const Mail = use('Mail')
const path = require('path')
const ICBNews = use('App/Models/ICBNews')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
const { validate } = use('Validator')
const Hash = use('Hash')
const speakeasy = require('speakeasy')
const Helpers = use('Helpers')
const HelperLibraries = use('App/Libraries/Helpers')
class ICBNewsController {
	/**
  	* @swagger
  	* /api/v1/admin/news/list:
  	*   get:
  	*     tags:
  	*       - AdminICBNews
  	*     summary: List news
  	*     security:
  	*       - Bearer: []
  	*     responses:
  	*       200:
  	*         description: News List
  	*/
  	async list ({request, response }) {
        var data = request.all()
        const models = await ICBNews.all()
        return response.respondWithSuccess(models , 'List News Successful!')
  	}
  	/**
       * @swagger
       * /api/v1/admin/news/create:
       *   post:
       *     tags:
       *       - AdminICBNews
       *     summary: Create news admin
       *     consumes:
       *       - multipart/form-data
       *     description: Create news admin
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
       *       - name: title
       *         description: Title
       *         in: query
       *         required: true
       *         type: string
       *         example : "Why choose us?"

       *       - name: intro
       *         description: Summary about this article
       *         in: query
       *         required: true
       *         type: string
       *         example : "Summary about this article"
       *
       *       - name: content
       *         description: Content detail
       *         in: query
       *         required: true
       *         type: string
       *         example : "<ul>Content detail</ul>"
       *         
       *       - name: level_id
       *         description: "
                  {
                    1 : 'Subscriber',
                    2 : 'Customer',
                    3 : 'Community Ambassador',
                    4 : 'Sales Member',
                    5 : 'Manager'
                  }
       "
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1

       *       - name: status
       *         description: "1 Display FE , 0 Hidden FE"
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1
       *         
       *     responses:
       *       200:
       *         description: Create news Admin
       */
    async create ({request, response }) {
      	var data = request.all()
        const rules = {
            title: 'required',
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
              await profilePic.move(Helpers.publicPath('uploads/news'), {
                  name: `${HelperLibraries.strString(data.title)}${new Date().getTime()}.${profilePic.subtype}`,
                  overwrite: true
              })

              if (!profilePic.moved()) {
                  return response.respondWithError('Validation is failed', profilePic.error())
              }
        }
        const trx = await Database.beginTransaction()
        const icbNews           = new ICBNews()
        icbNews.title   	      = data.title
        icbNews.slug        	  = HelperLibraries.strString(data.title)
        icbNews.intro 	        = data.intro
        icbNews.content      	  = data.content
        icbNews.status     	    = data.status
        icbNews.level_id      	= data.level_id
        if (profilePic != null) {
              icbNews.image 	= '/uploads/news/' + profilePic.fileName
        }
        await icbNews.save(trx)
        trx.commit()
        return response.respondWithSuccess(icbNews , 'Add Customer Successful!')
    }

      /**
      * @swagger
      * /api/v1/admin/news/edit:
      *   get:
      *     tags:
      *       - AdminICBNews
      *     summary: Edit News
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit News
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit News
      */
      	async edit ({params , request, response }) {
            var data = request.all()
            const model = await ICBNews.find(data.id)
            if (!model) {
                  return response.respondWithError('Not found id News!')
            }
            return response.respondWithSuccess(model , 'Get Id News Successful!')
      	}
    /**
       * @swagger
       * /api/v1/admin/news/update:
       *   post:
       *     tags:
       *       - AdminICBNews
       *     summary: Update News Admin
       *     consumes:
       *       - multipart/form-data
       *     description: Update News Admin
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
       *       - name: title
       *         description: Title
       *         in: query
       *         required: true
       *         type: string
       *         example : "Why choose us?"

       *       - name: intro
       *         description: Summary about this article
       *         in: query
       *         required: true
       *         type: string
       *         example : "Summary about this article"
       *
       *       - name: content
       *         description: Content detail
       *         in: query
       *         required: true
       *         type: string
       *         example : "<ul>Content detail</ul>"
       *         
       *       - name: level_id
       *         description: "
                  {
                    1 : 'Subscriber',
                    2 : 'Customer',
                    3 : 'Community Ambassador',
                    4 : 'Sales Member',
                    5 : 'Manager'
                  }
       "
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1
       
       *       - name: status
       *         description: "1 Display FE , 0 Hidden FE"
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1
       *         
       *     responses:
       *       200:
       *         description: Server is OK!
       */
  	async update ({request, response }) {
  		var data = request.all()
        const icbNews = await ICBNews.find(data.id)
        const rules = {
            title: 'required',
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
              if (icbNews.image != null) {
                    const fs = await require('fs')
                    if (fs.existsSync(Helpers.publicPath(icbNews.image))) {
                        fs.unlinkSync(Helpers.publicPath(icbNews.image))
                    }
              }
              await profilePic.move(Helpers.publicPath('uploads/news'), {
                  name: `${HelperLibraries.strString(data.title)}${new Date().getTime()}.${profilePic.subtype}`,
                  overwrite: true
              }) 
              if (!profilePic.moved()) {
                  return response.respondWithError('Validation is failed', profilePic.error())
              }
        }
        const trx = await Database.beginTransaction()
        icbNews.title           = data.title
        icbNews.slug            = HelperLibraries.strString(data.title)
        icbNews.intro           = data.intro
        icbNews.content          = data.content
        icbNews.status           = data.status
        icbNews.level_id        = data.level_id
        if (profilePic != null) {
            icbNews.image = '/uploads/news/' + profilePic.fileName
        }
        await icbNews.save(trx)
        trx.commit()
        return response.respondWithSuccess(icbNews , 'Update Customer Successful!')
  	}


      	/**
	      * @swagger
	      * /api/v1/admin/news/delete:
	      *   get:
	      *     tags:
	      *       - AdminICBNews
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
            const model = await ICBNews.find(data.id)
            if (!model) {
                  return response.respondWithError('Not found id News!')
            }
            if (model.image != null) {
                  const fs = await require('fs')
                  if (fs.existsSync(Helpers.publicPath(model.image))) {
                      fs.unlink(Helpers.publicPath(model.image))
                  }
            }
            model.delete()
            return response.respondWithSuccess([] , 'Delete Customer News!')
      	}
}
module.exports = ICBNewsController
