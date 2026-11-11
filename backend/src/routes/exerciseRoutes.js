const express = require("express");
const {
  getExercises,
  getExerciseById,
  getCategories,
  getLanguages,
  createExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect);

// Static sub-paths must be registered before the dynamic /:id route.
router.get("/categories", getCategories);
router.get("/languages", getLanguages);
router.get("/", getExercises);
router.get("/:id", getExerciseById);

router.post("/", requireAdmin, createExercise);
router.delete("/:id", requireAdmin, deleteExercise);

module.exports = router;
