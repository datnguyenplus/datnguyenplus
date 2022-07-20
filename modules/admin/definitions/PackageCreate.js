'use strict'

/** 
*  @swagger
*  definitions:
*    PackageCreate:
*      type: object
*      properties:
*        title:
*          type: string
*          example : "Package ETH 0.1ETH"
*        package_code:
*          type: string
*          example : "ICPC256456"
*        description:
*          type: string
*          example : "Sell/Buy package 0.1ETH"
*        content:
*          type: string
*          example : "Sell/Buy package 0.1ETH..."
*        price:
*          type: uint
*          example : 0.1
*        promotion_price:
*          type: uint
*          example : 0.09
*        point:
*          type: uint
*          example : 10
*        promotion_point:
*          type: uint
*          example : 9
*        package_category_id:
*          type: uint
*          example : 1
*        promotion_from:
*          type: string
*          example : "2019-07-05 10:29:58"
*        promotion_to:
*          type: string
*          example : "2020-07-05 10:29:58"
*      required:
*/
class PackageCreate{

}
module.exports = PackageCreate