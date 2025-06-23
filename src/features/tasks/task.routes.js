const router = require("express").Router();
const { auth } = require("@/middlewares/auth.middleware");
const {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} = require("./task.controller");
const { validateTaskBody } = require("@/utils/validation-helpers");
const validationMiddleware = require("@/middlewares/validation.middleware");

router.use(auth);
router.post("/", validateTaskBody(), validationMiddleware, createTask);
router.put("/:id", validateTaskBody(), validationMiddleware, updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/move", moveTask);

module.exports = router;
