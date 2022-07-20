"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CurrencyExchange extends Model {
  static get primaryKey() {
    return "id";
  }

  static get hidden() {
    return [];
  }

  static get table() {
    return "currency_exchanges";
  }

  static get createdAtColumn() {
    return "created_at";
  }

  static get updatedAtColumn() {
    return "updated_at";
  }
}

module.exports = CurrencyExchange;
