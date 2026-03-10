const db = require("../config/db");

// Get All Menu Items
exports.getMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        m.category_id,
        c.name AS category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      ORDER BY m.id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Menu By Category
exports.getMenuByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM menu_items
      WHERE category_id = ?
      ORDER BY id DESC
      `,
      [categoryId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching category items:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Menu Item (Admin)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category_id } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO menu_items 
      (name, description, price, image, category_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, description, price, image, category_id]
    );

    res.status(201).json({
      message: "Menu item created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Menu Price
exports.updateMenuPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    const [result] = await db.query(
      `
      UPDATE menu_items 
      SET price = ? 
      WHERE id = ?
      `,
      [price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Price updated successfully" });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Menu Item (Admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete any references in cart_items to prevent foreign key constraint errors
    await db.query(`DELETE FROM cart_items WHERE menu_item_id = ?`, [id]);

    // Check for references in menu_item_ingredients
    await db.query(`DELETE FROM menu_item_ingredients WHERE menu_item_id = ?`, [id]);

    const [result] = await db.query(
      `
      DELETE FROM menu_items 
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
