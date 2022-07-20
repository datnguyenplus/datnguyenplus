module.exports = {
  approveValidate: {
    approveRules: {
      note: "string",
      id: "required|integer",
      status: "required|string"
    },
    approveMessages: {
      required: "The field is required",
      "id.integer": "Id must be a number",
      "status.string": "Status must be a string"
    }
  },
  listValidate: {
    lstRules: {
      pageSize: "integer",
      pageIndex: "integer"
    },
    lstMessages: {
      integer: "The field must be a number"
    }
  }
};
