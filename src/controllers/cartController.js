const db = require("../config/db");

const addToCart = async (req, res) => {
  try {
    const { user_id, menu_item_id, quantity } = req.body;

    if (!user_id || !menu_item_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1️⃣ Check if cart exists
    const [cart] = await db.query(
      "SELECT * FROM carts WHERE user_id = ?",
      [user_id]
    );

    let cartId;

    if (cart.length === 0) {
      // Create new cart
      const [newCart] = await db.query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [user_id]
      );
      cartId = newCart.insertId;
    } else {
      cartId = cart[0].id;
    }

    // 2️⃣ Check if item already in cart
    const [existingItem] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
      [cartId, menu_item_id]
    );

    if (existingItem.length > 0) {
      // Update quantity
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity || 1, existingItem[0].id]
      );
    } else {
      // Get price from menu_items
      const [menuItem] = await db.query(
        "SELECT price FROM menu_items WHERE id = ?",
        [menu_item_id]
      );

      await db.query(
        "INSERT INTO cart_items (cart_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [cartId, menu_item_id, quantity || 1, menuItem[0].price]
      );
    }

    res.json({ message: "Item added to cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [cart] = await db.query(
      "SELECT * FROM carts WHERE user_id = ?",
      [user_id]
    );

    if (!cart.length) {
      return res.json({ items: [] });
    }

    const cartId = cart[0].id;

    const [items] = await db.query(
      `SELECT 
         ci.id,
         ci.menu_item_id,
         ci.quantity,
         ci.price,
         m.name,
         m.image
       FROM cart_items ci
       JOIN menu_items m ON ci.menu_item_id = m.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.json({ items });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  const { cart_item_id, change } = req.body;

  await db.query(
    "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
    [change, cart_item_id]
  );

  // Remove if quantity <= 0
  await db.query(
    "DELETE FROM cart_items WHERE id = ? AND quantity <= 0",
    [cart_item_id]
  );

  res.json({ message: "Updated" });
};

const removeCartItem = async (req, res) => {
  const { id } = req.params;

  await db.query(
    "DELETE FROM cart_items WHERE id = ?",
    [id]
  );

  res.json({ message: "Removed" });
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};

