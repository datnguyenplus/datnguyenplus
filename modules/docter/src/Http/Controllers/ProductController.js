'use strict'

const Mail = use('Mail')
const path = require('path')
const Env = use('Env')
const ProductServices       = use('TTSoft/Product/Services/ProductServices')
const ProductTransfomer     = use('TTSoft/Product/Transformers/ProductTransfomer')
class ProductController {

      constructor() {
          this.productTransfomer    = ProductTransfomer
          this.productService       = ProductServices;
      }
      /**
      * @swagger
      * /api/v1/docter/list:
      *   get:
      *     tags:
      *       - Docter_Auth
      *     summary: List Products
      *     security:
      *       - Bearer: []
      *     responses:
      *       200:
      *         description: Server is OK!
      *       500:
      *         description: Error Server Internal!
      */
      async getList ({request, response }) {
            const products = await this.productService.getList();
            const dataTransformers = this.productTransfomer.transformCollection(products);
            return response.respondWithSuccess(dataTransformers , 'List Product Successful!');
      }

      /**
      * @swagger
      * /api/v1/docter/create:
      *   post:
      *     tags:
      *       - Docter_Auth
      *     summary: Create New a Product.
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: info
      *         description: Product Object Value
      *         in:  body
      *         required: true
      *         type: string
      *         schema:
      *           example : {
      *              title : 'Product 01',
      *              price : 3000,
      *              category_id : 1,
      *              price_sale : 0,
      *              description : '',
      *              package_code : '',
      *              content : '',
      *              status : 1,
      *           }
      *     responses:
      *       200:
      *         description: Server is OK!
      *       500:
      *         description: Error Server Internal!
      */
      async postCreateProduct ({request, response }) {
            var data = request.all()
            const product = await this.productService.createNewProduct(data)
            const dataTransformer = this.productTransfomer.transform(product);
            return response.respondWithSuccess(dataTransformer , 'Create New a Product Successful!')
      }

      /**
      * @swagger
      * /api/v1/docter/edit:
      *   get:
      *     tags:
      *       - Docter_Auth
      *     summary: Get a Product
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: ID Product
      *         in: query
      *         required: false
      *         type: unit
      *         example : 1
      *     responses:
      *       200:
      *         description: Server is OK!
      *       500:
      *         description: Error Server Internal!
      */
      async findProduct ({request, response }) {
            var data = request.all()
            const product = await this.productService.findProduct(data.id);
            if (product) {
                  const dataTransformers = this.productTransfomer.transform(product);
                  return response.respondWithSuccess(dataTransformers , 'Get a Product Successful!');
            }
            return response.respondWithError('The Not Found Product ID!');
      }

      /**
      * @swagger
      * /api/v1/docter/update:
      *   put:
      *     tags:
      *       - Docter_Auth
      *     summary: Update a Product.
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: info
      *         description: Product Object Value
      *         in:  body
      *         required: true
      *         type: string
      *         schema:
      *           example : {
      *              id : 1,
      *              title : 'Product 01',
      *              price : 3000,
      *              category_id : 1,
      *              price_sale : 0,
      *              description : 'Product 01',
      *              content : '',
      *              status : 1,
      *           }
      *     responses:
      *       200:
      *         description: Server is OK!
      *       500:
      *         description: Error Server Internal!
      */
      async update ({request, response }) {
            var data = request.all()
            const product = await this.productService.updateProduct(data)
            if (product) {
                  const dataTransformer = this.productTransfomer.transform(product);
                  return response.respondWithSuccess(dataTransformer , 'Updated a Product Successful!')
            }
            return response.respondWithError('The Not Found Product ID!')            
      }

      /**
      * @swagger
      * /api/v1/docter/delete:
      *   delete:
      *     tags:
      *       - Docter_Auth
      *     summary: Delete a Product
      *     security:
      *       - Bearer: []
      *     parameters:
      *       - name: id
      *         description: ID Product
      *         in: query
      *         required: false
      *         type: unit
      *         example : 1
      *     responses:
      *       200:
      *         description: Server is OK!
      *       500:
      *         description: Error Server Internal!
      */
      async delete ({request, response }) {
            var data = request.all()
            const product = await this.productService.deleteProduct(data.id);
            if (product) {
                  return response.respondWithSuccess([] , 'Delete a Product Successful!');
            }
            return response.respondWithError('The Not Found Product ID!');
      }
}
module.exports = ProductController
