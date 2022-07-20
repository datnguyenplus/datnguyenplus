"use strict";

const UserToken = use("App/Models/UserToken");
const MessageCode = use("App/Libraries/MessageCode");

class AdminAuthorizationMiddleware {
  async handle({ request, response }, next) {
    var bearer = request.header("Authorization");
    if (bearer == null) {
      return response.respondWithError("Admin authorization is required!");
    }
    bearer = bearer.replace("Bearer", "");
    const customerToken = await UserToken.query()
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

module.exports = AdminAuthorizationMiddleware;
