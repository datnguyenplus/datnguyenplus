const CurrencyExchange = use("App/Models/CurrencyExchange");
const { CRC_EXCH, DIRECTION } = use("Root/utils/constants");

class CurrencyExchangeService {
  /**
   * currency exchange
   *
   * @param {String} fromCrc ex: USD, VND, ICB
   * @param {String} toCrc ex: USD, VND, ICB
   * @param {String} direction ex: LTR, RTL
   */
  static async getRate(fromCrc, toCrc, direction = DIRECTION.LTR) {
    const legalCrExch = [CRC_EXCH.USD, CRC_EXCH.ICB, CRC_EXCH.VND];
    let rate = 1;
    if (fromCrc === toCrc) return 0;
    if (!legalCrExch.includes(fromCrc) || !legalCrExch.includes(toCrc))
      return 0;
    else {
      const [crcLeft, crcRight] = await Promise.all([
        this.getCrExchByFromCrc(fromCrc),
        this.getCrExchByFromCrc(toCrc)
      ]);
      if (direction === DIRECTION.LTR) {
        rate = crcLeft.to_currency_value / crcRight.to_currency_value;
      } else {
        rate = crcRight.to_currency_value / crcLeft.to_currency_value;
      }
      return rate;
    }
  }

  /**
   *
   * @param {string} fromCrc USD, ICB, VND
   */
  static getCrExchByFromCrc(fromCrc) {
    return CurrencyExchange.query()
      .where({ from_currency: fromCrc })
      .first();
  }
}
module.exports = CurrencyExchangeService;
