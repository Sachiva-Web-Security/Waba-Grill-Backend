// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config(); // important

// const authRoutes = require("./routes/authRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const menuRoutes = require("./routes/menuRoutes");
// const deliveryRoutes = require("./routes/deliveryRoutes"); // NEW
// const cartRoutes = require("./routes/cartRoutes");
// const app = express();
// const path = require("path");
// // const paymentRoutes = require("./routes/payment");
// app.use(cors());
// app.use(express.json());
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "../uploads"))
// );

// app.use("/api/categories", categoryRoutes);
// app.use("/api/menu", menuRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/delivery", deliveryRoutes); // NEW
// app.use("/api/cart", cartRoutes);
// // app.use("/api/payment", paymentRoutes);
// module.exports = app;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct uploads path
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;