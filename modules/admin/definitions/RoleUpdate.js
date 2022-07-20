'use strict'

/** 
*  @swagger
*  definitions:
*    RoleUpdate:
*      type: object
*      properties:
*        id:
*          type: uint
*          example : 1
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
class RoleUpdate{

}
module.exports = RoleUpdate