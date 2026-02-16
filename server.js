const express = require('express');
require('dotenv').config();
const app = express();
const verifyToken = require('./middleware/verifyToken');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ recommended

app.use('/api/v1/auth', require('./routes/auth/route'));
app.use('/api/v1/transactions',verifyToken, require('./routes/transactions/route'));

app.get('/', (req, res) => {
    res.send("Welcome to the Task Management API");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})