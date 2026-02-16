const express = require('express');
const router = express.Router();
const { signIn,login } = require('../../controllers/authController');
const { checkSchema } = require("express-validator");
const signInSchema = require('../../schema/signInValidation');
const loginValidationSchema = require('../../schema/loginValidationSchema');

router.post('/signIn',checkSchema(signInSchema),signIn);
router.post('/login',checkSchema(loginValidationSchema),login);

module.exports = router;