const Board = require("../boards/board.model");
const Column = require("./column.model");
const Task = require("../tasks/task.model");
const { successResponse, errorResponse } = require("@/utils/response-helpers");

exports.createColumn = async (req, res, next) => {
  try {
    const { title, color, boardId, tasks } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return errorResponse(res, "Board not found", 404);
    }

    const column = new Column({ title, color, boardId, tasks });
    await column.save();

    board.columns.push(column._id);
    await board.save();

    successResponse(res, column, "Column created successfully", 201);
  } catch (err) {
    next(err);
  }
};

exports.updateColumn = async (req, res, next) => {
  try {
    const allowedFields = ["title", "color", "tasks", "boardId"];

    const column = await Column.findOne({ _id: req.params.id });

    if (!column) {
      return errorResponse(res, "Column not found", 404);
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        column[field] = req.body[field];
      }
    });

    const updated = await column.save();

    successResponse(res, updated, "Column updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.deleteColumn = async (req, res, next) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);

    if (!column) {
      return errorResponse(res, "Column not found", 404);
    }

    // Remove column from the board
    await Board.findByIdAndUpdate(column.boardId, {
      $pull: { columns: column._id },
    });

    // Delete associated tasks
    if (column.tasks && column.tasks.length > 0) {
      await Task.deleteMany({ _id: { $in: column.tasks } });
    }

    successResponse(res, null, "Column deleted successfully");
  } catch (err) {
    next(err);
  }
};
