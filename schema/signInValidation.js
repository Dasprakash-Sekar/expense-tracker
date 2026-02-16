const signInvalidation = {
    name: {
        in: ['body'],
        trim: true,
        exists: {
            errorMessage: 'name is required'
        },
        // stop further validators if exists fails
        
        isLength: {
            options: { min: 3 },
            errorMessage: 'name must be at least 3 characters'
        }
    },
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
    },
}

module.exports = signInvalidation