const axios = require("axios");
const Env = use("Env");
module.exports = {
  callAPI: function (data) {
    return new Promise((resolve, reject) => {
      const URL = "https://api.sendgrid.com/v3/mail/send";
      const Authenticate = `Bearer ${Env.get("SENDGIRD_SERECT_KEY")}`;
      const body = {
        from: {
          email: Env.get("MAIL_FROM_ADDRESS"),
        },
        personalizations: [
          {
            to: [
              {
                email: data.toEmail,
              },
            ],
            dynamic_template_data: data.drawData,
          },
        ],
        template_id: data.templateId,
      };
      axios({
        method: "POST",
        url: URL,
        data: body,
        headers: { Authorization: Authenticate },
      })
        .then((res) => {
          resolve({
            status: "success",
            data: res,
          });
        })
        .catch((error) => {
          resolve({
            status: "error",
            error: error,
          });
        });
    });
  },
  sendMail: function (data) {
    return this.callAPI(data);
  },
};
