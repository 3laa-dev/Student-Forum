const express = require('express');
const router = express.Router();
const control = require('../Controls/Admin.controls');
const validate = require('../Middlewares/Admin.validation');

router.post('/register' , validate.registerValidation ,  control.register)
router.post('/login',control.login);

module.exports = router;