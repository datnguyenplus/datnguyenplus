"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Wallets extends Model {
  static get primaryKey() {
    return "id";
  }

  static get table() {
    return "wallets";
  }

  static get createdAtColumn() {
    return "created_at";
  }

  static get updatedAtColumn() {
    return "updated_at";
  }
}

module.exports = Wallets;
