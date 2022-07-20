'use strict'

/** 
*  @swagger
*  definitions:
*    RoleCreate:
*      type: object
*      properties:
*        name:
*          type: string
*          example : "Super Admin"
*        description:
*          type: string
*          example : "Manage all system in the admin!"
*        permissions :
*          type: array
*          	items:
*            type: string
*            example : 1
*      required:
*/
class RoleCreate{

}
module.exports = RoleCreate