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
        const insertQuery = 'insert into transactions (transactionsId, userId, amount, categorie, type, note) values ($1, $2, $3, $4, $5, $6)';

        await pool.query(insertQuery, [uuidv4(), userId, amount, categorie, type, note]);

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
// select ca.name,total from categories as ca join ( select categorie ,sum(amount) as total from transactions where userId='b9f351c4-c5c1-4952-9029-3997f73f81d9' group by categorie) as tra on ca.categorieid=tra.categorie

const getReport = async (req, res) => {
    try {
        const userId = req.userId;

        const reportQuery = `
            SELECT ca.name as categoryName, SUM(t.amount) AS totalSpend
            FROM transactions t
            JOIN categories ca ON ca.categorieid = t.categorie
            WHERE t.userId = $1
            GROUP BY ca.name
        `;

        const userQuery = `
            SELECT name FROM users WHERE userId = $1
        `;

        const { rows: report } = await pool.query(reportQuery, [userId]);
        const { rows: user } = await pool.query(userQuery, [userId]);

        return res.status(200).json({
            userName: user[0]?.name,
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
    getReport
}   
