const loginValidationSchema = {
       email: {
        in: ['body'],
        trim: true,
        exists: {
            errorMessage: 'email is required'
        },
        // stop further validators if exists fails
        
        isLength: {
            options: { min: 3 },
            errorMessage: 'email must be at least 3 characters'
        }
    },
    password: {
        in: ['body'],
        trim: true,
        exists: {
            errorMessage: 'Password is required'
        },
        
        isLength: {
            options: { min: 3 },
            errorMessage: 'Password must be at least 3 characters'
        }
    }
}

module.exports = loginValidationSchema;