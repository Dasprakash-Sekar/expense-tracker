const { validationResult, matchedData } = require('express-validator');
const pool = require('../config/db');
const { v4: uuidv4 } = require("uuid");

const addExpence = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }
        const { amount, categorie, type, note } = matchedData(req);

        const userId = req.userId;
        const insertQuery = 'insert into transactions (transactionsId, userId, amount, categorie, type, note,createdDateTime) values ($1, $2, $3, $4, $5, $6,$7)';

        await pool.query(insertQuery, [uuidv4(), userId, amount, categorie, type, note, new Date()]);

        return res.status(201).json({
            message: 'Expence added successfully'
        });

    }
    catch (error) {
        console.error('Add Expence Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

const getTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        const selectQuery = `
            select t.transactionsid,t.amount,ca.name as categorie ,t.type,t.note
            from categories as ca
            join(
            select *
            from transactions where userId = $1
            ) as t on ca.categorieid = t.categorie
        `;
        const { rows } = await pool.query(selectQuery, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'No transactions found for the user'
            });
        }
        return res.status(200).json({
            transactions: rows
        });
    }
    catch (error) {
        console.error('Get Transactions Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

const addCategoryLimits = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }

        const { limits } = matchedData(req);
        const userId = req.userId;
        console.log('Received limits:', userId);

        const insertQuery = `INSERT INTO user_category_limits (userId, categorieId, monthlyLimit) 
        VALUES ($1, $2, $3) ON CONFLICT (userId, categorieId) DO UPDATE SET monthlyLimit = EXCLUDED.monthlyLimit;`

        await Promise.all(
            limits.map(limit =>
                pool.query(insertQuery, [userId, limit.categorie, limit.monthlyLimit])
            )
        )
        return res.status(200).json({
            message: 'Category limits added/updated successfully'
        });
    }
    catch (error) {
        console.error('Add Expence Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

const getReport = async (req, res) => {
    try {
        const month = +req.query.month.trim()
        const year = +req.query.year.trim()

        if (!month || !year) {
            return res.status(400).json({
                error: 'month and year query parameters are required'
            });
        }

        if ((month < 1 || month > 12) || year < 1970) {
            return res.status(400).json({
                error: 'month must be between 1 and 12 and year must be greater than 1970'
            });
        }


        const userId = req.userId;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const reportQuery = `
        SELECT 
        c.name AS categoryName,
        SUM(t.amount) AS totalSpend,
        ucl.monthlyLimit,
	    CASE 
        WHEN SUM(t.amount) <= ucl.monthlyLimit 
        THEN 'You are on Limit'
        ELSE 'Please do spend carfully'
        END AS status
        FROM categories AS c
        JOIN transactions AS t 
        ON c.categorieId = t.categorie
        JOIN user_category_limits AS ucl
        ON ucl.userId = t.userId
        AND ucl.categorieId = c.categorieId
        WHERE t.userId = $1 AND t.createdDateTime >= $2 AND t.createdDateTime <= $3
        GROUP BY c.name, ucl.monthlyLimit; `;

        const userQuery = `
            SELECT name FROM users WHERE userId = $1
        `;

        const totalSpendQuery = `
            SELECT SUM(amount) AS totalSpend FROM transactions WHERE userId = $1 AND createdDateTime >= $2 AND createdDateTime <= $3
        `;

        const { rows: report } = await pool.query(reportQuery, [userId, startDate, endDate]);
        const { rows: user } = await pool.query(userQuery, [userId]);
        const { rows: totalSpendResult } = await pool.query(totalSpendQuery, [userId, startDate, endDate]);

        return res.status(200).json({
            userName: user[0]?.name,
            totalSpend: totalSpendResult[0]?.totalspend || 0,
            report: report.length > 0 ? report : "No transactions found for the user"
        });

    } catch (error) {
        console.error('Get Report Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


module.exports = {
    addExpence,
    getTransactions,
    getReport,
    addCategoryLimits
}   
