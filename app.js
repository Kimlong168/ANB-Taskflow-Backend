require("dotenv").config();
require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const db = require("@/config/database");
const { errorResponse } = require("@/utils/response-helpers");
const { blacklistedTokens } = require("@/middlewares/auth.middleware");
const enableCors = require("@/middlewares/cors.middleware");

const authRoutes = require("@/features/auth/auth.routes");
const boardRoutes = require("@/features/boards/board.routes");
const columnRoutes = require("@/features/columns/column.routes");
const taskRoutes = require("@/features/tasks/task.routes");

app.use(enableCors);
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);

// error handling middleware
app.use((err, _req, res, _next) => {
  console.error("err", err.stack);
  errorResponse(res, "Something went wrong!", 500);
});

// Token blacklist cleanup
setInterval(() => {
  blacklistedTokens.clear();
}, process.env.BLACKLIST_CLEANUP_INTERVAL);

// Start the server
db.connect(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
