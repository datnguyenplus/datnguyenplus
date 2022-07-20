'use strict'

/** 
*  @swagger
*  definitions:
*    AddtoCartCustomer:
*      type: object
*      properties:
*        os_device:
*          type: string
*          example : "Chrome OS"
*        product_id:
*          type: unit
*          example : 1
*        ip_address:
*          type: string
*          example : "124.22.444.192"
*        price:
*          type: unit
*          example : 30000
*        quantity:
*          type: unit
*          example : 2
*        total:
*          type: unit
*          example : 60000
*        type:
*          type: string
*          example : "package"
*        last_name:
*          type: string
*          example : "Icare"
*        first_name:
*          type: string
*          example : " Base"
*        phone_number:
*          type: string
*          example : "09091231234"
*        email:
*          type: string
*          example : "icarebase@gmail.com"
*        gender:
*          type: string
*          example : "male"
*        address:
*          type: string
*          example : "22 Nguyen Cong Tru, Quan 1"
*        province:
*          type: string
*          example : "Ho Chi Minh"
*        country:
*          type: string
*          example : "Vietnam"
*        birthday:
*          type: unit
*          example : "1990-10-22"
*        company:
*          type: string
*          example : "Icarebase Company"
*        name:
*          type: string
*          example : "Persional"
*      required:
*        - os_device
*        - price
*        - quantity
*/
class AddtoCartCustomer{}
module.exports = AddtoCartCustomer