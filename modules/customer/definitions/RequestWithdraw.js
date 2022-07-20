'use strict'
/** 
*  @swagger
*  definitions:
*    RequestWithdraw:
*      type: object
*      properties:
*        amount:
*          type: unit
*          example : 500
*        note:
*          type: string
*          example : "Note request withdraw."
*        account_name:
*          type: string
*          example : "Nguyen Van Bede"
*        account_number:
*          type: string
*          example : "33302423904884029"
*        account_code:
*          type: string
*          example : "Vietcombank"
*        account_address:
*          type: string
*          example : "PGD. Phu Nhuan"
*      required:
*        - email
*/
class RequestWithdraw{
}
module.exports = RequestWithdraw