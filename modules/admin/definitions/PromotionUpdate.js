"use strict";

/**
 *  @swagger
 *  definitions:
 *    PromotionUpdate:
 *      type: object
 *      properties:
 *        id:
 *          type: unit
 *          example : 1
 *        title:
 *          type: string
 *          example : "Discount 20% For all product"
 *        type:
 *          type: string
 *          example : "product or combo or totalorder"
 *        description:
 *          type: string
 *          example : "<p>Discount 20% For all product</p>"
 *        quantity:
 *          type: number
 *          example : 1
 *        hasCommission:
 *          type: boolean
 *          example : true
 *        ableUsrIds:
 *          type: string
 *          example : "[1,2,3]"
 *        ablePakgIds:
 *          type: string
 *          example : "[1,2,3]"
 *        totalDiscount:
 *          type: number
 *          example : 2000
 *        start_date:
 *          type: string
 *          example : "2019-08-01 10:09:09"
 *        end_date:
 *          type: string
 *          example : "2019-08-30 10:09:09"
 *        value:
 *          type: uint
 *          example : 10
 *        type_value:
 *          type: string
 *          example : "price or percent"
 *      required:
 */
class PromotionUpdate {}
module.exports = PromotionUpdate;
