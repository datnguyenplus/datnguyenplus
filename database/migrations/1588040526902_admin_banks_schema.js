"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AdminBanksSchema extends Schema {
  up() {
    this.create("admin_banks", (table) => {
      table.increments();
      table.string("account_name");
      table.string("account_number");
      table.string("account_address");
      table.string("account_code");
      table.integer("creUsrId");
      table.integer("udpUsrId");
      table.integer("status").default(1);
      table.timestamps();
    });
  }

  down() {
    this.drop("admin_banks");
  }
}

module.exports = AdminBanksSchema;
