'use strict'

const Env = use('Env')
const Helpers = use('App/Libraries/Helpers')
const Level = use('App/Models/Level')
const {
  getCurrentCustomer , 
  getChildCustomerTree , 
  showTreeChildrenCustomer
} = use('App/Libraries/TraitsHelpers')
const Config = use('Config')
class LevelController {
    /**
     * @swagger
     * /api/v1/get-list-levels:
     *   get:
     *     tags:
     *       - FE_Level
     *     summary: Level
     *     security:
     *       - Bearer: []
     *     description: Level
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async getListLevels({request, response }) {
      const auth = await getCurrentCustomer(request.header('Authorization'))
      const levels = await Level.query().orderBy('level','ASC').fetch()
      return response.respondWithSuccess(levels , 'Get all level successful!')
    }  

    /**
     * @swagger
     * /api/v1/get-level:
     *   get:
     *     tags:
     *       - FE_Level
     *     summary: Level
     *     security:
     *       - Bearer: []
     *     description: Level
     *     parameters:
     *       - name: id
     *         description: Level ID
     *         in: query
     *         required: true
     *         type: string
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Server OK!
     */
    async getLevel({request, response }) {
      var data = request.all()
      const auth = await getCurrentCustomer(request.header('Authorization'))
      const level = await Level.query().where('id',data.id).orderBy('level','ASC').first()
      if (!level) {
        return response.respondWithError('Not found id level!')
      }
      return response.respondWithSuccess(level , 'Get level by id successful!')
    }  
}
module.exports = LevelController
