const mysql = require("mysql2");
require("dotenv").config(); // Ensure dotenv is loaded if this file is run directly


const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : "12345",
  database: process.env.MYSQLDATABASE || "wavagrill",
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("-----------------------------------------");
console.log("🔍 DATABASE CONFIGURATION LOGS:");
console.log("- Host from .env:", process.env.MYSQLHOST || "NOT FOUND (using localhost)");
console.log("- User from .env:", process.env.MYSQLUSER || "NOT FOUND (using root)");
console.log("- Database from .env:", process.env.MYSQLDATABASE || "NOT FOUND (using wavagrill)");
console.log("- Port from .env:", process.env.MYSQLPORT || "NOT FOUND (using 3306)");

// Distinguish between empty string and undefined
if (process.env.MYSQLPASSWORD === undefined) {
  console.log("- Password: NOT FOUND IN .ENV (using fallback '12345')");
} else if (process.env.MYSQLPASSWORD === "") {
  console.log("- Password: FOUND IN .ENV (but it is an EMPTY STRING)");
} else {
  console.log("- Password: FOUND IN .ENV (using your custom password)");
}
console.log("-----------------------------------------");

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected successfully ✅");
    connection.release();
  }
});

module.exports = pool.promise();