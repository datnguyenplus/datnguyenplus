'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const PackageCategory = use('App/Models/PackageCategory')
const MessageCode = use('App/Libraries/MessageCode')
const Helpers = use('App/Libraries/Helpers')
class PackageCategoryController {
      /**
      * @swagger
      * /api/v1/admin/package-category/list:
      *   get:
      *     tags:
      *       - AdminPackageCategory
      *     summary: List Categories Package
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Package
      */
      async list ({request, response }) {
            var data = request.all()
            const packages = await PackageCategory.all()
            return response.respondWithSuccess(packages , 'List Category Package Successful!')
      }
     /**
       * @swagger
       * /api/v1/admin/package-category/create:
       *   post:
       *     tags:
       *       - AdminPackageCategory
       *     summary: Create Categories Package
       *     security:
       *       - Bearer: []
       *     description: Create Categories Package
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Create Categories Package
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PackageCategoryCreate'
       *     responses:
       *       200:
       *         description: Create Package
       */
      async create ({request, response }) {
            var data = request.all()
            const package_category = new PackageCategory()
            package_category.title = data.title
            package_category.code = (data.code == null) ?  Helpers.generateCodeGame() : data.code
            package_category.description = data.description
            await package_category.save()
            return response.respondWithSuccess(package_category , 'Add Category Package Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/package-category/edit:
      *   get:
      *     tags:
      *       - AdminPackageCategory
      *     summary: Edit Categories Package
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: Edit Categories Package
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Edit Categories Package
      */
      async edit ({params , request, response }) {
            var data = request.all()
            const package_category = await PackageCategory.find(data.id)
            if (!package_category) {
                  return response.respondWithError('Not found id category!')
            }
            return response.respondWithSuccess(package_category , 'Get Id Category Package Successful!')
      }

      /**
       * @swagger
       * /api/v1/admin/package-category/update:
       *   post:
       *     tags:
       *       - AdminPackageCategory
       *     summary: Update Categories Package
       *     description: Update Categories Package
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: info
       *         description: Update Categories Package
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/PackageCategoryUpdate'
       *     responses:
       *       200:
       *         description: Update Categories Package
       */
      async update ({request, response }) {
            var data = request.all()
            const package_category = await PackageCategory.find(data.id)
            package_category.title = data.title
            package_category.description = data.description
            package_category.save()
            return response.respondWithSuccess(package_category , 'Update Category Package Successful!')
      }

      /**
      * @swagger
      * /api/v1/admin/package-category/delete:
      *   get:
      *     tags:
      *       - AdminPackageCategory
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
      *         description: Delete Categories Package
      */
      async delete ({request, response }) {
            var data = request.all()
            const package_category = await PackageCategory.find(data.id)
            if (!package_category) {
                  return response.respondWithError('Not found id category!')
            }
            package_category.delete()
            return response.respondWithSuccess([] , 'Delete Category Package Successful!')
      }
}
module.exports = PackageCategoryController
