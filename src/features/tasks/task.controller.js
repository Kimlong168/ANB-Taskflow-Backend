const Task = require("./task.model");
const Column = require("../columns/column.model");
const { successResponse, errorResponse } = require("@/utils/response-helpers");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, columnId, boardId } = req.body;

    const column = await Column.findById(columnId);
    if (!column) {
      return errorResponse(res, "Column not found", 404);
    }

    const task = new Task({
      title,
      description,
      priority,
      columnId,
      boardId,
    });
    await task.save();

    column.tasks.push(task._id);
    await column.save();

    successResponse(res, task, "Task created successfully", 201);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "priority",
      "columnId",
      "boardId",
    ];

    const task = await Task.findOne({ _id: req.params.id });

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updated = await task.save();

    successResponse(res, updated, "Task updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    await Column.findByIdAndUpdate(task.columnId, {
      $pull: { taskIds: task._id },
    });

    successResponse(res, null, "Task deleted successfully");
  } catch (err) {
    next(err);
  }
};

exports.moveTask = async (req, res, next) => {
  try {
    const { columnId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    // Remove task from old column
    await Column.findByIdAndUpdate(task.columnId, {
      $pull: { tasks: task._id },
    });

    // Update task with new columnId
    task.columnId = columnId;
    await task.save();

    // Add task to new column
    await Column.findByIdAndUpdate(columnId, {
      $push: { tasks: task._id },
    });

    successResponse(res, task, "Task moved successfully");
  } catch (err) {
    next(err);
  }
};
