const Setting = use("App/Models/Setting");
class MasterService {
  static getService(skey) {
    return Setting.query()
      .where({ skey })
      .first();
  }
}

module.exports = MasterService;
