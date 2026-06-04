const {
    validateFullName,
    validateEmail,
    validatePassword,
    validateLicenseType,
} = require('../utils/validators');

const validateMiddleware = {

    sendCode: (req, res, next) => {
        const { full_name, email, password, role, license_type } = req.body;

        const errors = [
            validateFullName(full_name),
            validateEmail(email),
            validatePassword(password),
            validateLicenseType(license_type, role),
        ].filter(Boolean);

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0] });
        }

        next();
    },

    login: (req, res, next) => {
        const { email, password } = req.body;

        const errors = [
            validateEmail(email),
            validatePassword(password),
        ].filter(Boolean);

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0] });
        }

        next();
    },
};

module.exports = validateMiddleware;