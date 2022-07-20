"use strict";

const Withdraw = use("App/Models/Withdraw");
const Database = use("Database");
const BaseServices = use("TTSoft/Customer/../utils/BaseServices");
const MasterService = use("TTSoft/Customer/services/MasterServices");
const CoreWalletSer = use("Root/services/WalletServices");
const CrcExchSer = use("Root/services/CrExchServices");
const { CRC_EXCH } = use("Root/utils/constants");
const { BadRequestError } = use("Root/core/errors");

class WithdrawController extends BaseServices {
  /**
   * @swagger
   * /api/v1/request-withdraw:
   *   post:
   *     tags:
   *       - FE_Withdraw
   *     summary: Withdraw account
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: data
   *         description: vank Account List
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/RequestWithdraw'
   *     description: Withdraw
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server is OK!
   */
  async requestWithdraw({ request, response }) {
    try {
      const data = request.all();
      const { usrId } = await super.getUsrId(request.header("Authorization"));
      // get fee default and wallet
      const [
        { value: feeDefault },
        wallet,
        rateVND,
        rateUSD
      ] = await Promise.all([
        MasterService.getService("withdraw_fee"),
        CoreWalletSer.findByCusId(usrId),
        CrcExchSer.getRate(CRC_EXCH.ICB, CRC_EXCH.VND),
        CrcExchSer.getRate(CRC_EXCH.ICB, CRC_EXCH.USD)
      ]);
      if (data.amount > wallet.amount) {
        return response.respondWithError(
          "Request withdraw failed. Currently amount not enough!"
        );
      }
      const amount = data.amount - feeDefault;
      const trx = await Database.beginTransaction();
      const withdraw = new Withdraw();
      withdraw.customer_id = usrId;
      withdraw.code = "ICBWD";
      withdraw.amount = amount;
      withdraw.fee = feeDefault;
      withdraw.crcVND = amount * rateVND;
      withdraw.crcUSD = amount * rateUSD;
      withdraw.note = data.note;
      withdraw.account_name = data.account_name;
      withdraw.account_number = data.account_number;
      withdraw.account_code = data.account_code;
      withdraw.account_address = data.account_address;
      withdraw.payment_withdraw = "request_customer";
      withdraw.status = "pending";
      await withdraw.save(trx);
      const str = "" + withdraw.id;
      const converId = "0000000";
      withdraw.code =
        withdraw.code +
        converId.substring(0, converId.length - str.length) +
        str;
      // update minus wallet
      const dataWallet = {
        amount: wallet.amount - data.amount
      };
      await Promise.all([
        withdraw.save(trx),
        CoreWalletSer.update(dataWallet, wallet.id)
      ]);
      trx.commit();
      return response.respondWithSuccess(
        withdraw,
        "Request withdraw successful. Please wait to admin approve!"
      );
      // send mail
    } catch (error) {
      return Promise.reject(new BadRequestError(error));
    }
  }
  /**
   * @swagger
   * /api/v1/list-withdraw:
   *   get:
   *     tags:
   *       - FE_Withdraw
   *     summary: Withdraw account
   *     security:
   *       - Bearer: []
   *     description: Withdraw
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server is OK!
   */
  async listWithdraw({ request, response }) {
    const { usrId } = await super.getUsrId(request.header("Authorization"));
    const withdraws = await Withdraw.query()
      .where("customer_id", usrId)
      .orderBy("id", "DESC")
      .fetch();
    return response.respondWithSuccess(withdraws);
  }
}
module.exports = WithdrawController;
