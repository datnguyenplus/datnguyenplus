"use strict";

const Env = use("Env");
const User = use("App/Models/User");
const UserToken = use("App/Models/UserToken");
const PasswordReset = use("App/Models/PasswordReset");
const Helpers = use("App/Libraries/Helpers");
const { validate } = use("Validator");
const Hash = use("Hash");
const { RolePermissions } = use("App/Libraries/PermissionHelpers");
class AuthController {
  /**
   * @swagger
   * /api/v1/admin/login:
   *   post:
   *     tags:
   *       - AdminAuth
   *     summary: Auth Login
   *     description: Admin Auth Login
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: info
   *         description: Admin Auth object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/UserLogin'
   *     responses:
   *       200:
   *         description: Admin Auth Login
   */
  async login({ request, response }) {
    const data = request.all();
    const rules = {
      email: "required",
      password: "required"
    };
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is failed!",
        validation.messages()
      );
    }
    const user = await User.query()
      .where("email", data.email)
      .orWhere("username", data.email)
      .first();
    if (user) {
      const validatePassword = await Hash.verify(data.password, user.password);
      if (validatePassword) {
        const user_token = await UserToken.query()
          .where("user_id", user.id)
          .first();
        if (user_token) {
          user.token = user_token.access_token;
        } else {
          const token = await UserToken.create({
            user_id: user.id,
            access_token: Helpers.generateToken()
          });
          user.token = token.access_token;
        }
        const rolePermistions = await RolePermissions(user);
        return response.respondWithSuccess(
          rolePermistions,
          "Login Successful!"
        );
      } else {
        return response.respondWithError("Email or password incorrect!");
      }
    } else {
      return response.respondWithError("Email or password incorrect!");
    }
  }

  /**
   * @swagger
   * /api/v1/admin/logout:
   *   get:
   *     tags:
   *       - AdminAuth
   *     summary: Admin Auth Logout
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Admin Auth Logout
   */
  async logout({ request, response }) {
    let bearer = request.header("Authorization");
    bearer = bearer.replace("Bearer", "");
    const userToken = await UserToken.query()
      .where("access_token", bearer)
      .first();
    userToken.delete();
    return response.respondWithSuccess([], "Logout Successful!");
  }

  /**
   * @swagger
   * /api/v1/admin/forgot-password:
   *   post:
   *     tags:
   *       - AdminAuth
   *     summary: Admin Auth Forgot
   *     description: User Forgot
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: info
   *         description: Admin Auth object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/UserForgotPassword'
   *     responses:
   *       200:
   *         description: Admin Auth Forgot
   */
  async forgot({ request, response }) {
    const data = request.all();
    const rules = {
      email: "required|email"
    };
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is failed",
        validation.messages()
      );
    }
    const user = await User.query()
      .where("email", data.email)
      .first();
    if (!user) {
      return response.respondWithError("Email not found!");
    }
    const token = Helpers.generate_token_reset_password();
    const password_reset = new PasswordReset();
    password_reset.email = user.email;
    password_reset.token = token;
    password_reset.type = "admin";
    await password_reset.save();

    /* SEND MAIL */
    let constTemplateId = use("TemplateId").TEMPLATE_ADMIN_FORGOT_PASSWORD;
    const ModelSendGird = await use("ModelSendGird").findSlugTemplate(
      constTemplateId
    );
    const userData = {
      toEmail: user.getEmailAttribute(),
      templateId: ModelSendGird.template_id,
      drawData: {
        full_name: user.getFullNameAttribute(),
        token: token,
        ADMIN_LINK_RESET_PASSWORD: Env.get("ADMIN_LINK_RESET_PASSWORD")
      }
    };
    const sendGird = await use("SendGird").sendMail(userData);
    if (sendGird.status === "success") {
      return response.respondWithSuccess(
        user.email,
        "Please check your email to reset password!"
      );
    }
    return response.respondWithError(
      "Current cant send mail. Please try agian later!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/new-password:
   *   post:
   *     tags:
   *       - AdminAuth
   *     summary: Admin Auth confirmForgot
   *     description: Admin Auth confirmForgot
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: info
   *         description: Admin Auth object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/UserNewPassword'
   *     responses:
   *       200:
   *         description: Admin Auth confirmForgot
   */
  async confirmForgot({ request, response }) {
    const data = request.all();
    const rules = {
      token: "required",
      new_password: "required"
    };
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is Failed",
        validation.messages()
      );
    }
    /* RESET PASSWORD */
    const password_reset = await PasswordReset.query()
      .where("token", data.token)
      .where("type", "admin")
      .first();
    if (password_reset) {
      const user = await User.query()
        .where("email", password_reset.email)
        .first();
      user.password = await Hash.make(data.new_password);
      await user.save();
      password_reset.delete();
      return response.respondWithSuccess(user, "Update password successfull!");
    } else {
      return response.respondWithError(
        "Not found request reset password for your email!"
      );
    }
  }

  /**
   * @swagger
   * /api/v1/admin/user-profile:
   *   get:
   *     tags:
   *       - AdminAuth
   *     summary: User Logout
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: User Logout
   */
  async userProfile({ request, response }) {
    const bearer = request.header("Authorization");
    bearer = bearer.replace("Bearer", "");
    const userToken = await UserToken.query()
      .where("access_token", bearer)
      .first();
    if (userToken) {
      const user = await User.find(userToken.user_id);
      const rolePermistions = await RolePermissions(user);
      return response.respondWithSuccess(
        rolePermistions,
        "Get Info User Successful!"
      );
    }
    return response.respondWithError("Your token invalid!");
  }
}
module.exports = AuthController;
