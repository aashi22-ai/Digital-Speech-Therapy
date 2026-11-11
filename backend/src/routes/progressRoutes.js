const express = require("express");
const {
  getProgress,
  refillHearts,
  claimChest,
  buyShopItem,
  getLeaderboard,
} = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/leaderboard", getLeaderboard);
router.post("/refill-hearts", refillHearts);
router.post("/claim-chest", claimChest);
router.post("/shop-buy", buyShopItem);
router.get("/:userId", getProgress);

module.exports = router;
