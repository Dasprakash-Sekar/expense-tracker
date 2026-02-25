const jwt = require("jsonwebtoken");
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId; // save user ID
    console.log("Decoded User ID:", req.userId); // Debugging log

    pool.query('SELECT userId FROM users WHERE userId = $1', [req.userId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // User exists, proceed to next middleware or route handler
      next();
    });
  });
};
module.exports = verifyToken;
