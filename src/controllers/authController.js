const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPass = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!validPass) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      "SECRETKEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user[0].role
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.register = async (req,res)=>{

  const {name,email,password} = req.body;

  const bcrypt = require("bcryptjs");

  const hashed = bcrypt.hashSync(password,10);

  await db.query(
    "INSERT INTO users (name,email,password,role) VALUES(?,?,?,?)",
    [name,email,hashed,"user"]
  );

  res.json({message:"Registered"});
};