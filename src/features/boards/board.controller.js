const Board = require("./board.model");
const Column = require("../columns/column.model");
const Task = require("../tasks/task.model");
const { successResponse, errorResponse } = require("@/utils/response-helpers");

exports.getOneBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate("userId")
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          model: "Task",
          options: { sort: { priority: -1 } },
        },
      });

    if (!board) {
      return errorResponse(res, "Board not found", 404);
    }

    successResponse(res, board, "Board fetched successfully");
  } catch (err) {
    next(err);
  }
};

exports.getAllBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ userId: req.user.id });
    successResponse(res, boards, "Boards fetched successfully");
  } catch (err) {
    next(err);
  }
};

exports.createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const board = new Board({
      title,
      description,
      userId: req.user.id,
    });
    await board.save();
    successResponse(res, board, "Board created successfully", 201);
  } catch (err) {
    next(err);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!board) {
      return errorResponse(res, "Board not found or not owned by user", 404);
    }

    const allowedFields = ["title", "description", "columns"];
    allowedFields.forEach((field) => {
      if (field in req.body) {
        board[field] = req.body[field];
      }
    });

    const updatedBoard = await board.save();

    successResponse(res, updatedBoard, "Board updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.deleteBoard = async (req, res, next) => {
  try {
    // Find the board and verify ownership
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!board) {
      return errorResponse(res, "Board not found or not owned by user", 404);
    }

    // Find all column IDs in the board
    const columnIds = board.columns;

    if (columnIds.length > 0) {
      // Find all tasks within those columns
      const columns = await Column.find({ _id: { $in: columnIds } });

      const allTaskIds = columns.flatMap((col) => col.tasks);

      // Delete all associated tasks
      if (allTaskIds.length > 0) {
        await Task.deleteMany({ _id: { $in: allTaskIds } });
      }

      // Delete all columns
      await Column.deleteMany({ _id: { $in: columnIds } });
    }

    // Delete the board
    await board.deleteOne();

    successResponse(res, null, "Board deleted successfully");
  } catch (err) {
    next(err);
  }
};
