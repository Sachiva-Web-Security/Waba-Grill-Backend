const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:user_id", getCart);
router.post("/update", updateCartItem);
router.delete("/remove/:id", removeCartItem);

module.exports = router;