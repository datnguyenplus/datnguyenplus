"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddSomeFieldsPromotionSchema extends Schema {
  up() {
    this.table("promotions", (table) => {
      table.integer("quantity").after("code").default(1);
      table.boolean("hasCommission").after("quantity").default(true);
      table.double("totalDiscount").after("quantity").default(0);
      table.integer("creUsrId").after("description");
      table.integer("udpUsrId").after("creUsrId");
      table.longtext("ableUsrIds").after("totalDiscount");
      table.longtext("ablePakgIds").after("ableUsrIds");
    });
  }

  down() {
    this.table("promotions", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddSomeFieldsPromotionSchema;
