const Promotion = use("App/Models/Promotion");
const Database = use("Database");
const { TYPE_PROMOTION } = use("Root/utils/constants");

class CorePrmtSevcs {
  /**
   * check promotion
   *
   * @param {string} code
   * @param {number} usrId
   * @param {number} prodId
   * @return null | promotion
   */
  static async checkPromotion(code, usrId, prodId) {
    let flag = false,
      today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const promotion = await Promotion.query()
      .where({ code, status: 1 })
      .where(Database.raw('DATE_FORMAT(start_date,"%Y-%m-%d")'), "<=", today)
      .where(Database.raw('DATE_FORMAT(end_date,"%Y-%m-%d")'), ">=", today)
      .first();
    if (promotion) {
      if (promotion.type !== TYPE_PROMOTION.ALL) {
        if (promotion.ableUsrIds)
          flag = JSON.parse(promotion.ableUsrIds).includes(usrId);
        if (promotion.ablePakgIds)
          flag = JSON.parse(promotion.ablePakgIds).includes(prodId);
      } else flag = true;
    }
    return flag ? promotion : null;
  }
}
module.exports = CorePrmtSevcs;
