"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Promotion extends Model {
  static get primaryKey() {
    return "id";
  }

  static get table() {
    return "promotions";
  }

  static get hidden() {
    return ["ableUsrIds", "ablePakgIds", "hasCommission"];
  }

  static get createdAtColumn() {
    return "created_at";
  }

  static get updatedAtColumn() {
    return "updated_at";
  }
}

module.exports = Promotion;
