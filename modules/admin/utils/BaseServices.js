const UserToken = use("App/Models/UserToken");

class BaseService {
  async getUsrId(token) {
    let usrId = null;
    if (token) {
      token = token.replace("Bearer", "");
      const usrToken = await UserToken.query()
        .where("access_token", token)
        .first();
      usrId = usrToken.user_id;
    }
    return { usrId };
  }
  list() {}
  create() {}
  update() {}
  findById() {}
  delete() {}
}

module.exports = BaseService;
