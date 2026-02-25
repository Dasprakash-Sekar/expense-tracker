const categoryLimitsValidation = {
    limits: {
        in: ["body"],
        exists: {
            errorMessage: "Limits array is required"
        },
        isArray: {
            errorMessage: "Limits must be an array"
        }
    },

    "limits.*.categorie": {
        in: ["body"],
        exists: {
            errorMessage: "Category ID is required"
        },
        isInt: {
            errorMessage: "Category ID must be an integer"
        },
        toInt: true
    },

    "limits.*.monthlyLimit": {
        in: ["body"],
        exists: {
            errorMessage: "Monthly limit is required"
        },
        isFloat: {
            options: { min: 0 },
            errorMessage: "Monthly limit must be a positive number"
        },
        toFloat: true
    }
};

module.exports = categoryLimitsValidation;