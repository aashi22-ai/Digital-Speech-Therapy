const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/exercises", require("./routes/exerciseRoutes"));
app.use("/api/attempts", require("./routes/attemptRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));

// Any /api/* path that didn't match a route above -> clean 404 JSON
// instead of Express's default HTML "Cannot GET ..." page.
app.use("/api", (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Serve built frontend if available (e.g. unified deployment)
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Centralized error handler. Recognizes a few common error shapes
// (multer upload errors, Mongoose validation/cast errors) and turns
// them into clear, consistent JSON instead of a generic 500.
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Audio file is too large (max 10MB)"
        : `Upload error: ${err.message}`;
    return res.status(400).json({ message });
  }

  if (err.name === "ValidationError") {
    // Mongoose schema validation failure
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    // e.g. an invalid ObjectId in a route param
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
