const Setting = use("App/Models/Setting");
class AuthServices {
  static getMemberIdDefault() {
    return Setting.query().where("skey", "member_id").first();
  }
}

module.exports = AuthServices;
