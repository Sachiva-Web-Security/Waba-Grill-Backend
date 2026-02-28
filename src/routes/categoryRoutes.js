// const express = require("express");
// const router = express.Router();
// const { getCategories } = require("../controllers/categoryController");

// const categoryRoutes = require("./routes/categoryRoutes");
// app.use(categoryRoutes);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categoryController");

router.get("/", getCategories);

module.exports = router;