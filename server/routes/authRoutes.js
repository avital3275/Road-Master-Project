const express             = require('express');
const router              = express.Router();
const authController      = require('../controllers/authController');
const validateMiddleware  = require('../middleware/validateMiddleware');

router.post('/send-code',
    validateMiddleware.sendCode,
    authController.sendCode
);

router.post('/verify',
    authController.verifyAndRegister
);

router.post('/login',
    validateMiddleware.login,
    authController.login
);

module.exports = router;