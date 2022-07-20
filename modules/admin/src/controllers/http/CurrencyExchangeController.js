"use strict";

const CurrencyExchange = use("App/Models/CurrencyExchange");
const BaseService = use("TTSoft/Admin/../utils/BaseServices");
const { CRC_EXCH } = use("Root/utils/constants");
class CurrencyExchangeController extends BaseService {
  /**
   * @swagger
   * /api/v1/admin/exchange/list:
   *   get:
   *     tags:
   *       - AdminCurrencyExchange
   *     summary: List Currency Exchange Package
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Package
   */
  async list({ request, response }) {
    const packages = await CurrencyExchange.all();
    return response.respondWithSuccess(
      packages,
      "List Currency Exchange Successful!"
    );
  }
  /**
   * @swagger
   * /api/v1/admin/exchange/create:
   *   post:
   *     tags:
   *       - AdminCurrencyExchange
   *     summary: Create Currency Exchange Package
   *     security:
   *       - Bearer: []
   *     description: Create Currency Exchange Package
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: info
   *         description: Create Currency Exchange Package </br> Defautl to_currency is VND and value's field to_currency_value is value for unit VND
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/ExchangerateCreate'
   *     responses:
   *       200:
   *         description: Create Package
   */
  async create({ request, response }) {
    const data = request.all();
    const { usrId } = await this.getUsrId(request.header("Authorization"));
    const exchange_rate = new CurrencyExchange();
    exchange_rate.from_currency = data.from_currency;
    exchange_rate.from_currency_value = 1;
    exchange_rate.to_currency = CRC_EXCH.VND;
    exchange_rate.to_currency_value = data.to_currency_value;
    exchange_rate.creUsr = usrId;
    await exchange_rate.save();
    return response.respondWithSuccess(
      exchange_rate,
      "Add Currency Exchange Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/exchange/edit:
   *   get:
   *     tags:
   *       - AdminCurrencyExchange
   *     summary: Edit Currency Exchange Package
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: Edit Currency Exchange Package
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Edit Currency Exchange Package
   */
  async edit({ request, response }) {
    var data = request.all();
    const exchange_rate = await CurrencyExchange.find(data.id);
    if (!exchange_rate) {
      return response.respondWithError("Not found id category!");
    }
    return response.respondWithSuccess(
      exchange_rate,
      "Get Id Currency Exchange Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/exchange/update:
   *   post:
   *     tags:
   *       - AdminCurrencyExchange
   *     summary: Update Currency Exchange Package
   *     description: Update Currency Exchange Package
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: info
   *         description: Update Currency Exchange Package
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/ExchangerateUpdate'
   *     responses:
   *       200:
   *         description: Update Currency Exchange Package
   */
  async update({ request, response }) {
    var data = request.all();
    const exchange_rate = await CurrencyExchange.find(data.id);
    exchange_rate.from_currency = data.from_currency;
    exchange_rate.from_currency_value = data.from_currency_value;
    exchange_rate.to_currency = data.to_currency;
    exchange_rate.to_currency_value = data.to_currency_value;
    exchange_rate.save();
    return response.respondWithSuccess(
      exchange_rate,
      "Update Currency Exchange Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/exchange/delete:
   *   get:
   *     tags:
   *       - AdminCurrencyExchange
   *     summary: Delete Currency Exchange Admin
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: Delete  Package
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Delete Currency Exchange Package
   */
  async delete({ request, response }) {
    var data = request.all();
    const exchange_rate = await CurrencyExchange.find(data.id);
    if (!exchange_rate) {
      return response.respondWithError("Not found id category!");
    }
    exchange_rate.delete();
    return response.respondWithSuccess(
      [],
      "Delete Currency Exchange Successful!"
    );
  }
}
module.exports = CurrencyExchangeController;
