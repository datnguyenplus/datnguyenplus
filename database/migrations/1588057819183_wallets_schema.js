"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class WalletsSchema extends Schema {
  up() {
    this.create("wallets", (table) => {
      table.increments();
      table.integer("customer_id");
      table.string("address");
      table.double("amount").default(0);
      table.string("unit", 50).default("ICB");
      table.integer("status").default(1);
      table.timestamps();
    });
  }

  down() {
    this.drop("wallets");
  }
}

module.exports = WalletsSchema;
