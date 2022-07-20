"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddSomeFieldInTransactionsSchema extends Schema {
  up() {
    this.table("withdraws", table => {
      table.double("fee").after("amount");
      table.double("crcVND").after("fee");
      table.double("crcUSD").after("crcVND");
      table.integer("usrId").after("file_transaction");
    });
  }

  down() {
    this.table("withdraws", () => {
      // reverse alternations
    });
  }
}

module.exports = AddSomeFieldInTransactionsSchema;
