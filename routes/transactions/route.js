const express = require('express');
const router = express.Router();
const { addExpence, getTransactions ,getReport} = require('../../controllers/transactionController');
const verifyToken = require('../../middleware/verifyToken');
const { checkSchema } = require("express-validator");
const addExpenceValidation = require('../../schema/addExpenceValidationSchema');

router.post('/add', verifyToken, checkSchema(addExpenceValidation), addExpence);
router.get('/transaction-list',  getTransactions);
router.get('/report',  getReport);

module.exports = router;

