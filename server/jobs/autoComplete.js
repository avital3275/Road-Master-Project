const lessonModel = require('../models/lessonModel');

const autoComplete = async () => {
    try {
        await lessonModel.autoCompleteExpiredLessons();
    } catch (err) {
        console.error('autoComplete error:', err.message);
    }
};

const scheduleAutoComplete = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight - now;

    setTimeout(() => {
        autoComplete();
        setInterval(autoComplete, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
};

module.exports = { autoComplete, scheduleAutoComplete };