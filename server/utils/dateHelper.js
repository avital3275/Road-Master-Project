const toMysqlDate = (dateStr) => {
    const pad  = (n) => String(n).padStart(2, '0');
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

module.exports = { toMysqlDate };