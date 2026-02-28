const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345", // agar password set nahi kiya to blank
  database: "wavagrill", // apna database name likho
  port: 3306
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected successfully ✅");
    connection.release();
  }
});

module.exports = db;