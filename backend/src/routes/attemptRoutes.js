const express = require("express");
const {
  createAttempt,
  getAttemptById,
  getAttemptsByUser,
} = require("../controllers/attemptController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);
router.post("/", upload.single("audio"), createAttempt);
router.get("/:id", getAttemptById);
router.get("/user/:userId", getAttemptsByUser);

module.exports = router;
