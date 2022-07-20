"use strict";
const BankAccount = use("App/Models/AdminBank");
const BaseService = use("TTSoft/Admin/../utils/BaseServices");

class AdmBankController extends BaseService {
  /**
   * @swagger
   * /api/v1/admin/bank/list:
   *   get:
   *     tags:
   *       - AdminBank
   *     security:
   *       - Bearer: []
   *     summary: Wallet deposit
   *     description: "Bank Account List"
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async list({ response }) {
    const listBankAccount = await BankAccount.query()
      .where("status", 1)
      .fetch();
    return response.respondWithSuccess(
      listBankAccount,
      "List Account Bank Successful!"
    );
  }
  /**
   * @swagger
   * /api/v1/admin/bank/create:
   *   post:
   *     tags:
   *       - AdminBank
   *     summary: Bank Account List
   *     security:
   *       - Bearer: []
   *     description: Bank Account List
   *     parameters:
   *       - name: data
   *         description: vank Account List
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           example: {
   *             account_name: "NGUYEN VAN A",
   *             account_number: "234562345",
   *             account_address: "Chi nhánh HCM",
   *             account_code: "BIDV"
   *           }
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async create({ request, response }) {
    const data = request.all();
    const { usrId } = await super.getUsrId(request.header("Authorization"));
    const bank_account = new BankAccount();
    bank_account.account_name = data.account_name.toUpperCase();
    bank_account.account_number = data.account_number;
    bank_account.account_address = data.account_address;
    bank_account.account_code = data.account_code;
    bank_account.creUsrId = usrId;
    await bank_account.save();
    return response.respondWithSuccess(
      bank_account,
      "Create New Bank Account Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/bank/update:
   *   post:
   *     tags:
   *       - AdminBank
   *     summary: Bank Account Update
   *     description: Bank Account Update
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: data
   *         description: Bank Account Update
   *         in: body
   *         required: true
   *         type: string
   *         schema:
   *           example: {
   *             id: 1,
   *             account_name: "NGUYEN VAN A",
   *             account_number: "234562345",
   *             account_address: "Chi nhánh HCM",
   *             account_code: "BIDV"
   *           }
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async update({ request, response }) {
    const data = request.all();
    const { usrId } = await super.getUsrId(request.header("Authorization"));
    const bank_account = await BankAccount.find(data.id);
    if (!bank_account) {
      return response.respondWithError(data, "Cant not found ID bank!");
    }
    bank_account.account_name = data.account_name.toUpperCase();
    bank_account.account_number = data.account_number;
    bank_account.account_address = data.account_address;
    bank_account.account_code = data.account_code;
    bank_account.udpUsrId = usrId;
    bank_account.save();
    return response.respondWithSuccess(
      bank_account,
      "Update Bank Account Successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/bank/delete:
   *   get:
   *     tags:
   *       - AdminBank
   *     security:
   *       - Bearer: []
   *     summary: Wallet deposit
   *     description: Bank Account Delete
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: ID
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async delete({ request, response }) {
    const data = request.all();
    const { usrId } = await super.getUsrId(request.header("Authorization"));
    const bank_account = await BankAccount.find(data.id);
    if (!bank_account) {
      return response.respondWithError("Can't found ID bank!", {
        status: false,
      });
    }
    bank_account.status = 0;
    bank_account.udpUsrId = usrId;
    bank_account.save();
    return response.respondWithSuccess(
      { status: true },
      "Delete bank Successful!"
    );
  }
}
module.exports = AdmBankController;
