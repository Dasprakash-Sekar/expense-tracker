const express = require('express');
const router = express.Router();
const { addExpence, getTransactions, getReport, addCategoryLimits } = require('../../controllers/transactionController');
const { checkSchema } = require("express-validator");
const addExpenceValidation = require('../../schema/addExpenceValidationSchema');
const limitsValidation = require('../../schema/limitsSchema');

router.post('/add',  checkSchema(addExpenceValidation), addExpence);
router.get('/transaction-list', getTransactions);
router.post('/category-limits',  checkSchema(limitsValidation), addCategoryLimits);
router.get('/report', getReport);

module.exports = router;

