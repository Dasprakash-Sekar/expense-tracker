const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (plainPassword) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);
    return hashedPassword;
};

const comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,comparePassword
};