const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getMenuItems,
  getMenuByCategory,
  createMenuItem,
  updateMenuPrice,
  deleteMenuItem,
} = require("../controllers/menuController");

// Public Routes
router.get("/", getMenuItems);
router.get("/category/:categoryId", getMenuByCategory);

// 🔐 Protected Route (Admin Only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createMenuItem
);

router.put(
  "/:id/price",
  authMiddleware,
  adminMiddleware,
  updateMenuPrice
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMenuItem
);

module.exports = router;