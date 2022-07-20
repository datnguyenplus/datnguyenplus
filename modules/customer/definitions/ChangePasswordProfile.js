'use strict'

/** 
*  @swagger
*  definitions:
*    ChangePasswordProfile:
*      type: object
*      properties:
*        current_password:
*          type: string
*          example : "123456@1"
*        password:
*          type: string
*          example : "123456@2"
*      required:
*        - current_password
*        - password
*/
class ChangePasswordProfile{}
module.exports = ChangePasswordProfile