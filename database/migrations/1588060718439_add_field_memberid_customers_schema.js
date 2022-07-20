"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddFieldMemberidCustomersSchema extends Schema {
  up() {
    this.table("customers", (table) => {
      table.integer("memberId").after("id");
    });
  }

  down() {
    this.table("customers", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddFieldMemberidCustomersSchema;
