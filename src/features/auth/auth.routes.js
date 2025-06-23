const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");
const { auth } = require("@/middlewares/auth.middleware");
const {
  validateRegisterBody,
  validateLoginBody,
} = require("@/utils/validation-helpers");
const { upload } = require("@/config/multer");
const { fileTypeValidation } = require("@/middlewares/file-upload.middleware");
const validationMiddleware = require("@/middlewares/validation.middleware");

router.post(
  "/register",
  upload.single("image"),
  fileTypeValidation,
  validateRegisterBody(),
  validationMiddleware,
  authController.register
);

router.post(
  "/login",
  validateLoginBody(),
  validationMiddleware,
  authController.login
);

router.post("/logout", authController.logout);

router.post("/refresh-token", auth, authController.refreshToken);

module.exports = router;
