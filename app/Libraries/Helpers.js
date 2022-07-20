"use strict";

const Env = use("Env");

class Helpers {
  static generateToken(limit = 40) {
    var uid = require("rand-token");
    var token = Env.get("APP_NAME", "icarebase") + "-" + uid.generate(limit);
    return token;
  }
  static generateKeySponsor(limit = 7) {
    var uid = require("rand-token");
    var token = "ICB" + uid.generate(limit);
    return token;
  }

  static generate_token_reset_password(limit = 60) {
    var uid = require("rand-token");
    var token = uid.generate(limit);
    return token;
  }

  static generateCodeGame(limit = 10) {
    var uid = require("rand-token");
    var token = uid.generate(limit);
    return token;
  }

  static customerCode(limit = 13) {
    var uid = require("rand-token");
    var customerCode = "icb" + uid.generate(limit);
    return customerCode.toUpperCase();
  }

  static converJsonSetting(settingsJSON) {
    var obj = {
      site: {},
      company: {},
      smtp_email: {},
      payment: {},
    };
    for (var i = 0; i < settingsJSON.length; i++) {
      let ts = settingsJSON[i].skey;
      let type = settingsJSON[i].type;
      switch (type) {
        case "site":
          obj.site[ts] = settingsJSON[i].value;
          break;
        case "company":
          obj.company[ts] = settingsJSON[i].value;
          break;
        case "smtp_email":
          obj.smtp_email[ts] = settingsJSON[i].value;
          break;
        case "payment":
          obj.payment[ts] = settingsJSON[i].value;
          break;
        default:
      }
    }
    return obj;
  }

  static strString(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
      "-"
    );
    str = str.replace(/-+-/g, "-");
    str = str.replace(/^\-+|\-+$/g, "");
    return str;
  }
}
module.exports = Helpers;
