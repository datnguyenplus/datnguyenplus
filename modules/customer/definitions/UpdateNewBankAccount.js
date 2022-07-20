'use strict'

/** 
*  @swagger
*  definitions:
*    UpdateNewBankAccount:
*      type: object
*      properties:
*        id:
*          type: unit
*          example : 1
*        account_name:
*          type: string
*          example : "NGUYEN VAN A"
*        account_number:
*          type: string
*          example : "245234342342343233"
*        account_address:
*          type: string
*          example : "PGD. Phu Nhuan"
*        account_code:
*          type: string
*          example : "VCB"
*      required:
*        - account_name
*        - account_number
*        - account_code
*/
class UpdateNewBankAccount{}
module.exports = UpdateNewBankAccount