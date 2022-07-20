"use strict";

const Mail = use("Mail");
const path = require("path");
const Env = use("Env");
const Package = use("App/Models/Package");
const Combo = use("App/Models/Combo");
const PackageCategory = use("App/Models/PackageCategory");
const MessageCode = use("App/Libraries/MessageCode");
const Database = use("Database");
const HelperLibrary = use("App/Libraries/Helpers");
const Helpers = use("Helpers");
const { validate } = use("Validator");
const ProductCommisions = use("App/Models/ProductCommisions");
const collect = require("collect.js");
class PackageController {
  /**
   * @swagger
   * /api/v1/admin/package/list:
   *   get:
   *     tags:
   *       - AdminPackage
   *     summary: List Package
   *     security:
   *       - Bearer: []
   *     responses:
   *       200:
   *         description: Package
   */
  async list({ request, response }) {
    var data = request.all();
    const packages = await Package.query().orderBy("position", "ASC").fetch();
    return response.respondWithSuccess(packages, "List Package Successful!");
  }
  /**
       * @swagger
       * /api/v1/admin/package/create:
       *   post:
       *     tags:
       *       - AdminPackage
       *     summary: Create Package
       *     consumes:
       *       - multipart/form-data
       *     description: Create Package Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - in: formData
       *         name: image
       *         type: file
       *         description: The file to upload.
       *         
       *       - name: title
       *         description: Title
       *         in: query
       *         required: true
       *         type: string
       *         example : "Test Gen"

       *       - name: category_id
       *         description: Category ID
       *         in: query
       *         required: true
       *         type: string
       *         example : "1"

       *       - name: price
       *         description: Price (Currency USD) 
       *         in: query
       *         required: false
       *         type: unit
       *         example : 500

       *       - name: price_sale
       *         description: Price sell final (USD)
       *         in: query
       *         required: false
       *         type: unit
       *         example : 450

       *       - name: package_code
       *         description: Package code
       *         in: query
       *         required: true
       *         type: string
       *         example : "ICPC20190806"
       *         
       *       - name: description
       *         description: Description
       *         in: query
       *         required: false
       *         type: string
       *         example : "Test Gen"
       *         
       *       - name: content
       *         description: Content Detail
       *         in: query
       *         required: false
       *         type: string
       *         example : "<p>Content about testgen</p>"
       *
       *       - name: status
       *         description: "1 Display on Frontend, 0 Hidden on FE"
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1
       *     responses:
       *       200:
       *         description: Create Customer Admin
       */
  async create({ request, response }) {
    var data = request.all();
    const rules = {
      title: "required",
      price: "required",
      package_code: "required|unique:products,package_code",
      status: "required",
    };
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is failed!",
        validation.messages()
      );
    }
    const profilePic = request.file("image", {
      types: ["image"],
      size: "2mb",
    });

    if (profilePic != null) {
      await profilePic.move(Helpers.publicPath("uploads/products"), {
        name: `${HelperLibrary.strString(data.title)}${new Date().getTime()}.${
          profilePic.subtype
        }`,
        overwrite: true,
      });

      if (!profilePic.moved()) {
        return response.respondWithError(
          "Validation is failed",
          profilePic.error()
        );
      }
    }
    const trx = await Database.beginTransaction();
    const product = new Package();
    product.title = data.title;
    product.price = data.price;
    product.package_category_id = data.category_id;
    product.price_sale = data.price_sale != null ? data.price_sale : 0;
    product.description = data.description;
    product.package_code =
      data.package_code != null
        ? data.package_code
        : HelperLibrary.generateCodeGame();
    product.content = data.content;
    if (profilePic != null) {
      product.image = "/uploads/products/" + profilePic.fileName;
    }
    product.status = data.status;
    await product.save(trx);
    trx.commit();
    return response.respondWithSuccess(product, "Add Customer Successful!");
  }

  /**
   * @swagger
   * /api/v1/admin/package/edit:
   *   get:
   *     tags:
   *       - AdminPackage
   *     summary: Edit Package
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: Edit Package
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Edit Package
   */
  async edit({ params, request, response }) {
    var data = request.all();
    const product = await Package.find(data.id);
    if (!product) {
      return response.respondWithError("Not found id package!");
    }
    return response.respondWithSuccess(product, "Get Id Package Successful!");
  }

  /**
       * @swagger
       * /api/v1/admin/package/update:
       *   post:
       *     tags:
       *       - AdminPackage
       *     summary: Update Package
       *     consumes:
       *       - multipart/form-data
       *     description: Create Update Admin
       *     security:
       *       - Bearer: []
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: id
       *         description: ID
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1

       *       - in: formData
       *         name: image
       *         type: file
       *         description: The file to upload.
       *         
       *       - name: title
       *         description: Title
       *         in: query
       *         required: true
       *         type: string
       *         example : "Test Gen"

       *       - name: category_id
       *         description: Category ID
       *         in: query
       *         required: true
       *         type: string
       *         example : "1"

       *       - name: price
       *         description: Price (Currency USD) 
       *         in: query
       *         required: false
       *         type: unit
       *         example : 500

       *       - name: price_sale
       *         description: Price sell final (USD)
       *         in: query
       *         required: false
       *         type: unit
       *         example : 450

       *       - name: package_code
       *         description: Package code is Disable
       *         in: query
       *         required: true
       *         type: string
       *         example : "ICPC20190806"
       *         
       *       - name: description
       *         description: Description
       *         in: query
       *         required: false
       *         type: string
       *         example : "Test Gen"
       *         
       *       - name: content
       *         description: Content Detail
       *         in: query
       *         required: false
       *         type: string
       *         example : "<p>Content about testgen</p>"
       *
       *       - name: status
       *         description: "1 Display on Frontend, 0 Hidden on FE"
       *         in: query
       *         required: false
       *         type: unit
       *         example : 1
       *     responses:
       *       200:
       *         description: Create Customer Admin
       */
  async update({ request, response }) {
    var data = request.all();
    const rules = {
      title: "required",
      price: "required",
      status: "required",
    };
    const trx = await Database.beginTransaction();
    const validation = await validate(data, rules);
    if (validation.fails()) {
      return response.respondWithError(
        "Validation is failed!",
        validation.messages()
      );
    }
    const profilePic = request.file("image", {
      types: ["image"],
      size: "2mb",
    });
    const product = await Package.find(data.id);
    if (!product) {
      return response.respondWithError("Not found id package!");
    }
    if (profilePic != null) {
      if (product.image != null) {
        const fs = await require("fs");
        if (fs.existsSync(Helpers.publicPath(product.image))) {
          fs.unlinkSync(Helpers.publicPath(product.image));
        }
      }
      await profilePic.move(Helpers.publicPath("uploads/products"), {
        name: `${HelperLibrary.strString(data.title)}${new Date().getTime()}.${
          profilePic.subtype
        }`,
        overwrite: true,
      });
      if (!profilePic.moved()) {
        return response.respondWithError(
          "Validation is failed",
          profilePic.error()
        );
      }
    }
    product.title = data.title;
    product.price = data.price;
    product.package_category_id = data.category_id;
    product.price_sale = data.price_sale != null ? data.price_sale : 0;
    product.description = data.description;
    product.content = data.content;
    if (profilePic != null) {
      product.image = "/uploads/products/" + profilePic.fileName;
    }
    product.status = data.status;
    await product.save(trx);
    trx.commit();
    return response.respondWithSuccess(product, "Update Customer Successful!");
  }

  /**
   * @swagger
   * /api/v1/admin/package/delete:
   *   get:
   *     tags:
   *       - AdminPackage
   *     summary: Delete User Admin
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: Delete Package
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Delete Package
   */
  async delete({ request, response }) {
    var data = request.all();
    const product = await Package.find(data.id);
    if (!product) {
      return response.respondWithError("Not found id package!");
    }
    product.delete();
    return response.respondWithSuccess(product, "Delete Package Successful!");
  }
  /* ------------------------------------ CONFIG COMMISSIONS ----------------------------------*/

  /**
   * @swagger
   * /api/v1/admin/package/config/list:
   *   get:
   *     tags:
   *       - AdminPackage
   *     summary: List config commisions for the package
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: id
   *         description: get list
   *         in: query
   *         required: false
   *         type: string
   *       - name: type
   *         description: package or combo
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async configList({ request, response }) {
    var data = request.all();
    /* get all config of product */
    const productsConfig = await ProductCommisions.query()
      .select("level_type", "value")
      .where("product_id", data.id)
      .where("type", data.type)
      .fetch();
    var dataPrice;
    if (data.type == "package") {
      dataPrice = await Package.query()
        .select("price")
        .where("id", data.id)
        .first();
    } else {
      dataPrice = await Combo.query()
        .select("price")
        .where("id", data.id)
        .first();
    }
    var object = {
      commisions: productsConfig,
      price: dataPrice,
    };
    return response.respondWithSuccess(
      object,
      "List config commisions successful!"
    );
  }

  /**
   * @swagger
   * /api/v1/admin/package/config/create:
   *   post:
   *     tags:
   *       - AdminPackage
   *     summary: Create config commisions for the package
   *     security:
   *       - Bearer: []
   *     parameters:
   *       - name: info
   *         description: Create config commisions for the package
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/PackageConfigCommissions'
   *     responses:
   *       200:
   *         description: Server OK!
   */
  async configCreate({ request, response }) {
    var data = request.all();
    var configs = data.configs;
    /* delete all config of product */
    await ProductCommisions.query()
      .where("product_id", data.product_id)
      .where("type", data.type)
      .delete();
    for (var i in configs) {
      var val = configs[i];
      const productCommisions = new ProductCommisions();
      productCommisions.type = data.type;
      productCommisions.product_id = data.product_id;
      productCommisions.level_type = val.level_type;
      productCommisions.value = val.value;
      await productCommisions.save();
    }
    /* get all config of product */
    const productsConfig = await ProductCommisions.query()
      .select("level_type", "value")
      .where("product_id", data.product_id)
      .where("type", data.type)
      .fetch();
    var dataPrice;
    if (data.type == "package") {
      dataPrice = await Package.query()
        .select("price")
        .where("id", data.product_id)
        .first();
    } else {
      dataPrice = await Combo.query()
        .select("price")
        .where("id", data.product_id)
        .first();
    }
    var object = {
      commisions: productsConfig,
      price: dataPrice,
    };
    return response.respondWithSuccess(
      object,
      "Create config commisions successful!"
    );
  }
}
module.exports = PackageController;
