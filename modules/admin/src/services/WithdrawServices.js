const Withdraw = use("App/Models/Withdraw");

class WithdrawService {
  static findById(wdId) {
    return Withdraw.findBy({ id: wdId });
  }
}
module.exports = WithdrawService;
