"use strict";

const Env = use("Env");
const Customer = use("App/Models/Customer");

const {
  getCurrentCustomer,
  getChildCustomerTree,
  showTreeChildrenCustomer
} = use("App/Libraries/TraitsHelpers");

const { validate } = use("Validator");
const Database = use("Database");
const Hash = use("Hash");
const Helpers = use("Helpers");
const Queue = use("Queue");
const Mail = use("Mail");
class ProfileController {
  /**
   * @swagger
   * /api/v1/update-profile:
   *   post:
   *     tags:
   *       - FE_Profile
   *     summary: My Profile
   *     consumes:
   *       - multipart/form-data
   *     description: My Profile
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: formData
   *         name: image
   *         type: file
   *         description: Please choose file to upload.
   *
   *       - name: first_name
   *         description: First Name
   *         in: query
   *         required: false
   *         type: string
   *         example : "Dat"
   *
   *       - name: last_name
   *         description: Last Name
   *         in: query
   *         required: false
   *         type: string
   *         example : "Nguyen"
   *
   *       - name: phone_number
   *         description: Phone Number
   *         in: query
   *         required: false
   *         type: string
   *         example : "0388912345"
   *
   *       - name: country
   *         description: "Country"
   *         in: query
   *         required: false
   *         type: string
   *         example : "Vietnam"
   *
   *       - name: province
   *         description: "Province"
   *         in: query
   *         required: false
   *         type: string
   *         example : "TP. Ho Chi Minh"
   *
   *       - name: address
   *         description: "Address"
   *         in: query
   *         required: false
   *         type: string
   *         example : "12/2 , Bình Thạnh"
   *
   *       - name: gender
   *         description: Gender
   *         in: query
   *         required: false
   *         type: string
   *         example : "male"
   *
   *       - name: passport
   *         description: Passport
   *         in: query
   *         required: false
   *         type: string
   *         example : "3322445566"
   *     responses:
   *       200:
   *         description: The request has succeeded.
   */
  async updateProfile({ request, response }) {
    var data = request.all();
    const customer = await getCurrentCustomer(request.header("Authorization"));
    const profilePic = request.file("image", {
      types: ["image"],
      size: "2mb"
    });
    if (profilePic != null) {
      if (customer.image != null) {
        const fs = await require("fs");
        if (fs.existsSync(Helpers.publicPath(customer.image))) {
          fs.unlink(Helpers.publicPath(customer.image));
        }
      }
      await profilePic.move(Helpers.publicPath("uploads/customers"), {
        name: `${customer.username}${new Date().getTime()}.${
          profilePic.subtype
        }`,
        overwrite: true
      });
      if (!profilePic.moved()) {
        return response.respondWithError(
          "Validation is failed",
          profilePic.error()
        );
      }
    }
    const trx = await Database.beginTransaction();
    if (data.first_name != null) {
      customer.first_name = data.first_name;
    }
    if (data.last_name != null) {
      customer.last_name = data.last_name;
    }
    if (data.phone_number != null) {
      customer.phone_number = data.phone_number;
    }
    if (data.country != null) {
      customer.country = data.country;
    }
    if (data.province != null) {
      customer.province = data.province;
    }
    if (data.address != null) {
      customer.address = data.address;
    }
    if (data.gender != null) {
      customer.gender = data.gender;
    }
    if (data.passport != null) {
      customer.passport = data.passport;
    }
    if (profilePic != null) {
      customer.image = "/uploads/customers/" + profilePic.fileName;
    }
    await customer.save(trx);
    trx.commit();
    return response.respondWithSuccess(
      customer,
      "Update your profile successfull!"
    );
  }

  /**
   * @swagger
   * /api/v1/two-factor-auth:
   *   post:
   *     tags:
   *       - FE_Profile
   *     summary: Two Factor
   *     description: Update Two Factor Authenticate
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: data
   *         description: Two Factor
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/TwaFactorAuthenticate'
   *     responses:
   *       200:
   *         description: The request has succeeded.
   */
  async twoFactorAuth({ request, response }) {
    var data = request.all();
    const customer = await getCurrentCustomer(request.header("Authorization"));
    customer.is_tow_factor_auth = data.is_tow_factor_auth;
    customer.save();
    return response.respondWithSuccess(
      customer,
      "Update two factor authenticate successfull!"
    );
  }

  /**
   * @swagger
   * /api/v1/change-password:
   *   post:
   *     tags:
   *       - FE_Profile
   *     summary: Change password
   *     description: Change password
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: data
   *         description: Change password
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/ChangePasswordProfile'
   *     responses:
   *       200:
   *         description: The request has succeeded.
   */
  async changePassword({ request, response }) {
    var data = request.all();
    const customer = await getCurrentCustomer(request.header("Authorization"));
    const validateCurrentPassword = await Hash.verify(
      data.current_password,
      customer.password
    );
    if (!validateCurrentPassword) {
      return response.respondWithError(
        "The password old entered incorrect. Please try again!"
      );
    }
    customer.password = await Hash.make(data.password);
    customer.save();
    return response.respondWithSuccess(
      customer,
      "Change the password successfull!"
    );
  }

  /**
   * @swagger
   * /api/v1/invite-friend:
   *   post:
   *     tags:
   *       - FE_Profile
   *     summary: Invite friends
   *     description: Invite friends
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: data
   *         description: Invite friends
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/InviteFriend'
   *     responses:
   *       200:
   *         description: The request has succeeded.
   */
  async inviteFriend({ request, response }) {
    var data = request.all();
    const customer = await getCurrentCustomer(request.header("Authorization"));
    var userData = {
      email: data.email,
      full_name: customer.first_name + " " + customer.last_name,
      sponsor_key: customer.sponsorKey,
      CUSTOMER_LINK_INVITE_FRIEND: Env.get("CUSTOMER_LINK_INVITE_FRIEND")
    };
    if (Env.get("QUEUE_CONNECTION") == "redis") {
      Queue.clear().then(
        response => {
          console.log("response");
        },
        error => {
          console.log("error");
        }
      );
      const SendMailInviteFriend = use(
        "App/Jobs/Producers/SendMailInviteFriend"
      );
      Queue.dispatch(new SendMailInviteFriend({ data: userData }));
    } else {
      await Mail.send("emails.customer_invite_friend", userData, message => {
        message
          .to(userData.email)
          .from(Env.get("MAIL_FROM_ADDRESS"), Env.get("MAIL_FROM_NAME"))
          .subject(
            "ICAREBASE! You just received invite from " + userData.full_name
          );
      });
    }
    return response.respondWithSuccess(
      userData.email,
      "Your invite has beed sended to the email!"
    );
  }

  /**
   * @swagger
   * /api/v1/ref-info-user:
   *   get:
   *     tags:
   *       - FE_Profile
   *     summary: Ref Tree User
   *     description: Ref Tree User
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The request has succeeded.
   */
  async refInfoUser({ request, response }) {
    var data = request.all();
    const customer = await getCurrentCustomer(request.header("Authorization"));
    customer.level = 0;
    const customers = await Customer.query()
      .select("*")
      .fetch();
    var objCustomers = customers.toJSON();
    var sponsor_id = customer.id,
      level = 1;
    const arrLevelCustomers = showTreeChildrenCustomer(
      objCustomers,
      sponsor_id,
      level
    );
    arrLevelCustomers.push(customer);
    return response.respondWithSuccess(
      arrLevelCustomers,
      "List Ref successfull!"
    );
  }
}
module.exports = ProfileController;
