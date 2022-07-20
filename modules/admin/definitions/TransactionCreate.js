'use strict'
/** 
*  @swagger
*  definitions:
*    TransactionCreate:
*      type: object
*      properties:
*        order_id:
*          type: unit
*          example : 5
*        payment_method:
*          type: string
*          example : "banktransfer"
*        type:
*          type: string
*          example : 'admin'
*        amount :
*          type: unit
*          example : 4000
*        status:
*          type: unit
*          example : 1
*      required:
*/
class TransactionCreate{

}
module.exports = TransactionCreate