const addExpenceValidationSchema = {
    amount: {
        in: ['body'],
        exists: {
            errorMessage: 'Amount is required'
        },
        isFloat: {
            options: { gt: 0 },
            errorMessage: 'Amount must be a number greater than 0'
        },
        toFloat: true
    },
    categorie: {
        in: ['body'],
        exists: {
            errorMessage: 'Categorie is required'
        },
        trim: true,
        isIn: {
            options: [[1, 2, 3, 4, 5,6]], // Assuming categories are represented as integers
            errorMessage: 'Categorie must be one of the following: Food, Transport, Entertainment, Utilities, Other'
        },
        toInt: true
    },
    type: {
        in: ['body'],
        exists: {
            errorMessage: 'Type is required'
        },
        trim: true,
        isIn: {
            options: [['debit', 'credit']],
            errorMessage: 'Type must be either "debit" or "credit"'
        }
    },
    note: {
        in: ['body'],
        optional: true,
        trim: true,
        isString: {
            errorMessage: 'Note must be a string'
        },
        isLength: {
            options: { max: 255 },
            errorMessage: 'Note must not exceed 255 characters'
        }
    }
}

module.exports = addExpenceValidationSchema;