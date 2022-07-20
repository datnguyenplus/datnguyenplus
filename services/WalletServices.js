const Wallet = use("App/Models/Wallet");
const { v5, v4 } = use("uuid");
const { APP_NAMESPACE_WALLET } = use("Root/utils/constants");

class CoreWalletSevcs {
  static async create(usrId) {
    try {
      const address = v5(APP_NAMESPACE_WALLET, v4());
      const wallet = new Wallet();
      wallet.customer_id = usrId;
      wallet.address = `ICB${address}`;
      await wallet.save();
      return wallet;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * update wallet by entity
   *
   * @param {Object} entity entity's wallet
   * @param {Number} walletId
   */
  static update(entity, walletId) {
    return Wallet.query()
      .where({ id: walletId })
      .update(entity);
  }

  static findByCusId(cusId) {
    return Wallet.findBy({ customer_id: cusId });
  }
}
module.exports = CoreWalletSevcs;
