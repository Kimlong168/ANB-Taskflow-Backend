const { body } = require("express-validator");

// register
const validateRegisterBody = () => {
  return [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").notEmpty().isEmail().withMessage("Email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
};

// login
const validateLoginBody = () => {
  return [
    body("email").notEmpty().isEmail().withMessage("Email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
};

// board
const validateBoardBody = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required.")
      .isString()
      .withMessage("Title must be a string."),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),

    body("columns")
      .optional()
      .isArray()
      .withMessage("Columns must be an array."),
  ];
};

// column
const validateColumnBody = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required.")
      .isString()
      .withMessage("Title must be a string."),

    body("color").optional().isString().withMessage("Color must be a string."),

    body("boardId")
      .notEmpty()
      .withMessage("Board ID is required.")
      .isMongoId()
      .withMessage("Board ID must be a valid MongoDB ObjectId."),

    body("tasks").optional().isArray().withMessage("Tasks must be an array."),
  ];
};

// task
const validateTaskBody = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required.")
      .isString()
      .withMessage("Title must be a string."),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),

    body("priority").optional(),

    body("columnId")
      .notEmpty()
      .withMessage("Column ID is required.")
      .isMongoId()
      .withMessage("Column ID must be a valid MongoDB ObjectId."),

    body("boardId")
      .notEmpty()
      .withMessage("Board ID is required.")
      .isMongoId()
      .withMessage("Board ID must be a valid MongoDB ObjectId."),
  ];
};

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  validateBoardBody,
  validateColumnBody,
  validateTaskBody,
};
