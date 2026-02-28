const db = require("../config/db");

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
