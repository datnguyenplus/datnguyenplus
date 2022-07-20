'use strict'

/** 
*  @swagger
*  definitions:
*    CreateOrder:
*      type: object
*      properties:
*        status:
*          type: unit
*          example : 1
*        customer_id:
*          type: unit
*          example : 1
*        quantity:
*          type: unit
*          example : 1
*        promotion_code:
*          type: string
*          example : ICB20190801
*        promotion_value:
*          type: unit
*          example : 400000
*        total_pay:
*          type: unit
*          example : 400000
*        node:
*          type: string
*          example : "Paid 50% For Order with : ICB20190801"
*        payment_type:
*          type: string
*          example : "alepay"
*        order_details:
*         type: object
*         	$ref: '#/definitions/OrderDetailCreate'
*      required:
*/
class CreateOrder{}
module.exports = CreateOrder