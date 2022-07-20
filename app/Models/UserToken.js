"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class UserToken extends Model {
  static get primaryKey() {
    return "id";
  }

  static get table() {
    return "user_tokens";
  }

  static get createdAtColumn() {
    return "created_at";
  }

  static get updatedAtColumn() {
    return "updated_at";
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = UserToken;
