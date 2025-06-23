const router = require("express").Router();
const { auth } = require("@/middlewares/auth.middleware");
const {
  createColumn,
  updateColumn,
  deleteColumn,
} = require("./column.controller");
const { validateColumnBody } = require("@/utils/validation-helpers");
const validationMiddleware = require("@/middlewares/validation.middleware");

router.use(auth);
router.post("/", validateColumnBody(), validationMiddleware, createColumn);
router.put("/:id", validateColumnBody(), validationMiddleware, updateColumn);
router.delete("/:id", deleteColumn);
module.exports = router;
