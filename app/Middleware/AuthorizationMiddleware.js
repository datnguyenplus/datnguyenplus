"use strict";

const CustomerToken = use("App/Models/CustomerToken");

class AuthorizationMiddleware {
  async handle({ request, response }, next) {
    var bearer = request.header("Authorization");
    if (bearer == null) {
      return response.respondWithError("Authorization is required!");
    }
    bearer = bearer.replace("Bearer", "");
    const customerToken = await CustomerToken.query()
      .where("access_token", bearer)
      .first();
    if (!customerToken) {
      return response.respondWithError(
        "The token is incorrect. Please use a token valid!"
      );
    }
    await next();
  }
}

module.exports = AuthorizationMiddleware;
