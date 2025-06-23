const router = require("express").Router();
const { auth } = require("@/middlewares/auth.middleware");
const {
  getOneBoard,
  getAllBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("./board.controller");
const { validateBoardBody } = require("@/utils/validation-helpers");
const validationMiddleware = require("@/middlewares/validation.middleware");

router.use(auth);
router.get("/:id", getOneBoard);
router.get("/", getAllBoards);
router.post("/", validateBoardBody(), validationMiddleware, createBoard);
router.put("/:id", validateBoardBody(), validationMiddleware, updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
