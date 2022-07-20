"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddCreUsrIdInTblCurrencyExchangeSchema extends Schema {
  up() {
    this.table("currency_exchanges", (table) => {
      table.integer("creUsr");
    });
  }

  down() {
    this.table("currency_exchanges", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddCreUsrIdInTblCurrencyExchangeSchema;
