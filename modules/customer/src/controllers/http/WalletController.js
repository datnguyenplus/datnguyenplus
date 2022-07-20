'use strict'

const Env = use('Env')

class WalletController {
/**
   * @swagger
   * /api/v1/wallet-info:
   *   get:
   *     tags:
   *       - FE_Wallet
   *     summary: Wallet account
   *     security:
   *       - Bearer: []
   *     description: Balance & Commission
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  	async index ({request, response }) {
        var data = request.all()
        return response.respondWithSuccess(data)
  	}

  	/**
	   * @swagger
	   * /api/v1/wallet-withdraw:
	   *   post:
	   *     tags:
	   *       - FE_Wallet
	   *     summary: Wallet withdraw
	   *     description: Wallet withdraw
     *     security:
     *       - Bearer: []
	   *     produces:
	   *       - application/json
	   *     responses:
	   *       200:
	   *         description: Server OK!
	   */
  	async withdraw ({request, response }) {
        var data = request.all()
        return response.respondWithSuccess(data)
  	}

  	/**
	   * @swagger
	   * /api/v1/wallet-deposit:
	   *   post:
	   *     tags:
	   *       - FE_Wallet
     *     security:
     *       - Bearer: []
	   *     summary: Wallet deposit
	   *     description: From Alepay Or ETH wallet
	   *     produces:
	   *       - application/json
	   *     responses:
	   *       200:
	   *         description: Server OK!
	   */
  	async deposit ({request, response }) {
        var data = request.all()
        return response.respondWithSuccess(data)
  	}
}
module.exports = WalletController
