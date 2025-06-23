const { validationResult } = require("express-validator");
const { errorResponse } = require("@/utils/response-helpers");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return errorResponse(res, message, 400);
  }
  next();
};

module.exports = validationMiddleware;
