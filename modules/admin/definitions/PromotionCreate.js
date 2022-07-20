"use strict";

/**
 *  @swagger
 *  definitions:
 *    PromotionCreate:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          example : "Discount 20% For all product"
 *        code:
 *          type: string
 *          example : "ICBDC20190806"
 *        type:
 *          type: string
 *          example : "product or combo or totalorder"
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
 *        description:
 *          type: string
 *          example : "<p>Discount 20% For all product</p>"
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
class PromotionCreate {}
module.exports = PromotionCreate;
