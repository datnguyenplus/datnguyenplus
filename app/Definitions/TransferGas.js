'use strict'

/** 
*  @swagger
*  definitions:
*    TransferGas:
*      type: object
*      properties:
*        from:
*          type: string
*          example : "0x89173cD980cac42f39d1E439D1757b2016d62C41"
*        privateKey:
*          type: string
*          example : "97375854b0f0f9a179cec44cc0cf4296d2d152a458f638d2586a75be155660ec"
*        to:
*          type: string
*          example : "0x3aad0b13e5b786f8c275ec81fa782718a0bb74e5"
*        amount:
*          type: uint
*          example : 0.001
*        gas:
*          type: uint
*          example : 21000
*      required:
*        - from
*        - privateKey
*        - to
*        - amount
*/
class TransferGas{

}
module.exports = TransferGas