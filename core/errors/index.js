const { LogicalException } = use("@adonisjs/generic-exceptions");

module.exports = {
  /**
   * Bad request HTTP error
   *
   * @class BadRequestError
   * @extends {Error}
   */
  BadRequestError: class BadRequestError extends LogicalException {
    /**
     * Creates an instance of BadRequestError.
     *
     * @param {String} message
     *
     * @memberOf BadRequestError
     */
    constructor(msg) {
      super(msg, 400, "Bad Request");
    }
  },

  DatabaseError: class DatabaseError extends LogicalException {
    constructor(err) {
      // TODO: Handle Error
      super(err.message, 400, "BAD REQUEST");
    }
  },
};
