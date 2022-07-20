"use strict";

const UserToken = use("App/Models/UserToken");
const User = use("App/Models/User");
const { RolePermissions } = use("App/Libraries/PermissionHelpers");
const MessageCode = use("App/Libraries/MessageCode");

class CanAccessMiddleware {
  async handle({ request, response }, next, ...args) {
    var bearer = request.header("Authorization");
    bearer = bearer.replace("Bearer", "");
    const customerToken = await UserToken.query()
      .where("access_token", bearer)
      .first();
    const user = await User.find(customerToken.user_id);
    const rolePermistions = await RolePermissions(user);
    const rolePermistionsName = rolePermistions.permissions;
    let expression = args[0];
    if (Array.isArray(expression)) {
      expression = expression[0];
    }
    var checkPermission = rolePermistionsName.indexOf(expression);
    if (checkPermission == -1) {
      return response.respondWithError(
        "You dont have permission to access this url!"
      );
    }
    await next();
  }
}

module.exports = CanAccessMiddleware;
