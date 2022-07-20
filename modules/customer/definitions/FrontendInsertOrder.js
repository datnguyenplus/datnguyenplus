'use strict'

/** 
*  @swagger
*  definitions:
*    FrontendInsertOrder:
*      type: object
*      properties:
*        quantity:
*          type: unit
*          example : 1
*        promotion_code:
*          type: string
*          example : ''
*        promotion_value:
*          type: unit
*          example : 0
*        total_pay:
*          type: unit
*          example : 3000
*        node:
*          type: string
*          example : "Paid 50% For Order with : ICB20190801"
*        payment_type:
*          type: string
*          example : "alepay"
*        order_details:
*         type: object
*         	$ref: '#/definitions/OrderDetailFrontend'
*      required:
*/
class FrontendInsertOrder{}
module.exports = FrontendInsertOrder