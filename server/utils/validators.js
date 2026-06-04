const validateFullName = (full_name) => {
    if (!full_name || full_name.trim().length < 2) {
        return 'שם מלא חייב להכיל לפחות 2 אותיות';
    }
    return null;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return 'כתובת אימייל לא תקינה';
    }
    return null;
};

const validatePassword = (password) => {
    const passwordRegex = /^[a-zA-Z]{1,8}$/;
    if (!password || !passwordRegex.test(password)) {
        return 'סיסמא חייבת להכיל בין 1 ל-8 אותיות אנגליות בלבד';
    }
    return null;
};

const validateLicenseType = (license_type, role) => {
    const validTypes = ['A', 'B', 'C', 'D'];

    if (role === 'student') {
        if (!validTypes.includes(license_type)) {
            return 'סוג רישיון לא תקין';
        }
    }

    if (role === 'teacher') {
        let types;
        try {
            types = JSON.parse(license_type);
        } catch {
            return 'סוגי רישיון לא תקינים';
        }
        if (!Array.isArray(types) || types.length === 0) {
            return 'מורה חייב לבחור לפחות סוג רישיון אחד';
        }
        if (!types.every(t => validTypes.includes(t))) {
            return 'אחד מסוגי הרישיון לא תקין';
        }
    }

    return null;
};

module.exports = {
    validateFullName,
    validateEmail,
    validatePassword,
    validateLicenseType,
};