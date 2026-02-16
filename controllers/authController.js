const { validationResult, matchedData } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/hashing');
const { v4: uuidv4 } = require("uuid");
const pool = require('../config/db');
const jwt = require('jsonwebtoken');


const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }

    const { name, email, password } = matchedData(req);

    const checkUser = await pool.query(
      'SELECT UserId FROM users WHERE email = $1',
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const hashedPassword = hashPassword(password);

    // Insert user
    await pool.query(
      'INSERT INTO users (userId, name, email, password) VALUES ($1, $2, $3, $4) ',
      [uuidv4(), name, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'User created successfully'
    });

  }
  catch (error) {
    console.error('SignIn Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }

    const { email, password } = matchedData(req);

    const userResult = await pool.query(
      'SELECT UserId, password FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid email or password'
      });
    }

    const userToken = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '100h' });
    return res.status(200).json({
      message: 'Login successful',
      token: userToken
    });
  }
  catch (error) {
    console.error('SignIn Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}


module.exports = {
  signIn, login
}