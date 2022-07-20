"use strict";
const { ServiceProvider } = require("@adonisjs/fold");

class AdminServiceProvider extends ServiceProvider {
  _registerRoutes() {
    const path = require("path");
    this.app.autoload(
      path.join(__dirname, "../src/controllers/http/"),
      "Admin"
    );
  }

  _registerResponses() {
    const Response = use("Adonis/Src/Response");
    Response.macro("respondWithSuccess", function (data = [], msg = "") {
      const objects = {
        status_code: 200,
        status: "success",
        message: msg,
        data: data,
      };
      this.status(200).send(objects);
    });

    Response.macro("respondWithError", function (msg = "", data = []) {
      const objects = {
        status_code: 404,
        status: "failed",
        message: msg,
        data: data,
      };
      this.status(200).send(objects);
    });
  }

  register() {
    this._registerRoutes();
  }

  boot() {
    require("../src/routes.js");
    this._registerResponses();
  }
}

module.exports = AdminServiceProvider;
