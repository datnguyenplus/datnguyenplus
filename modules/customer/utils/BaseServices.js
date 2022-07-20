const CustomerToken = use("App/Models/CustomerToken");

class BaseService {
  async getUsrId(token) {
    let usrId = null;
    if (token) {
      token = token.replace("Bearer", "");
      const usrToken = await CustomerToken.query()
        .where("access_token", token)
        .first();
      usrId = usrToken.customer_id;
    }
    return { usrId };
  }
}

module.exports = BaseService;
