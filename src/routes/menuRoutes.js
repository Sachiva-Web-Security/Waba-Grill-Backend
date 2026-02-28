const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getMenuItems,
  getMenuByCategory,
  createMenuItem,
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

module.exports = router;