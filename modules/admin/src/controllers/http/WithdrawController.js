"use strict";

const Withdraw = use("App/Models/Withdraw");
const { validate } = use("Validator");
const Queue = use("Queue");
const SendMailJob = use("App/Jobs/Producers/SendEMail");
const Database = use("Database");
const BaseServices = use("TTSoft/Admin/../utils/BaseServices");
const WithdrawServices = use("TTSoft/Admin/services/WithdrawServices");
const CoreWalletSer = use("Root/services/WalletServices");
const Helpers = use("Helpers");
const HelperLibraries = use("App/Libraries/Helpers");
const { BadRequestError } = use("Root/core/errors");
const { approveValidate, listValidate } = use("./validators/WithdrawValidator");
class WithdrawController extends BaseServices {
  /**
   * @swagger
   * /api/v1/admin/withdraw/approve:
   *   post:
   *     tags:
   *       - AdminWithdraw
   *     summary: Withdraw account
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: ID
   *         in: query
   *         required: false
   *         type: unit
   *         example : 1
   *       - in: formData
   *         name: file_transaction
   *         type: file
   *         description: The file to upload.
   *       - name: note
   *         description: 'Note'
   *         in: query
   *         required: false
   *         type: string
   *         example : "OK"
   *       - name: status
   *         description: 'completed | pending | failed'
   *         in: query
   *         required: false
   *         type: string
   *         example : "completed"
   *     description: Withdraw
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server is OK!
   */
  async approveWithdraw({ request, response }) {
    try {
      const { id, note = "", status } = request.all();
      // !TODO validate
      const validation = await validate(
        { id, note, status },
        approveValidate.approveRules,
        approveValidate.approveMessages
      );
      if (validation.fails())
        return response.respondWithError(validation.messages()[0].message);
      // !TODO update withdraw
      const trx = await Database.beginTransaction();
      const [{ usrId }, withdraw] = await Promise.all([
        super.getUsrId(request.header("Authorization")),
        WithdrawServices.findById(id)
      ]);
      const date_completed =
        new Date().toISOString().slice(0, 10) +
        " " +
        new Date().toISOString().slice(11, 19);
      const profilePic = request.file("file_transaction", {
        types: ["image"],
        size: "2mb"
      });
      if (profilePic !== null) {
        await profilePic.move(Helpers.publicPath("uploads/withdraws"), {
          name: `${HelperLibraries.strString(
            withdraw.code
          )}${new Date().getTime()}.${profilePic.subtype}`,
          overwrite: true
        });
        if (!profilePic.moved()) {
          return response.respondWithError(
            "Validation is failed",
            profilePic.error()
          );
        }
        withdraw.file_transaction = "/uploads/withdraws/" + profilePic.fileName;
      }
      if (status === "completed" && !profilePic)
        return response.respondWithError(
          "Validation is failed: file_transaction not null"
        );
      withdraw.date_completed = date_completed;
      withdraw.note = note;
      withdraw.status = status;
      withdraw.usrId = usrId;
      await withdraw.save(trx);
      // refund the wallet if cancel this withdraw
      if (status === "failed") {
        const wallet = await CoreWalletSer.findByCusId(withdraw.customer_id);
        wallet.amount += withdraw.amount + withdraw.fee;
        await wallet.save(trx);
      }
      trx.commit();
      const jobSendMail = new SendMailJob({ data: "abc" });
      Queue.dispatch(jobSendMail);
      jobSendMail.on("complete", res => {
        console.log(res);
      });

      return response.respondWithSuccess(
        withdraw,
        "Approved this request withdraw successful!"
      );
      //send mail
    } catch (error) {
      return Promise.reject(new BadRequestError(error));
    }
  }
  /**
   * @swagger
   * /api/v1/admin/withdraw/list:
   *   get:
   *     tags:
   *       - AdminWithdraw
   *     summary: Withdraw account
   *     security:
   *       - Bearer: []
   *     description: Withdraw
   *     parameters:
   *       - name: pageSize
   *         description: page size
   *         in: query
   *         required: false
   *         type: number
   *         example : 10
   *       - name: pageIndex
   *         description: page index
   *         in: query
   *         required: false
   *         type: number
   *         example : 1
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Server is OK!
   */
  async listWithdraw({ request, response }) {
    const { pageSize = Number.MAX_SAFE_INTEGER, pageIndex = 1 } = request.all();
    // !TODO validate
    const validation = await validate(
      { pageIndex, pageSize },
      listValidate.lstRules,
      listValidate.lstMessages
    );
    if (validation.fails())
      return response.respondWithError(validation.messages()[0].message);
    const withdraws = await Withdraw.query()
      .with("customer")
      .orderBy("id", "DESC")
      .paginate(pageIndex, pageSize);
    return response.respondWithSuccess(
      withdraws,
      "Get list withdraw successfully"
    );
  }
}
module.exports = WithdrawController;
