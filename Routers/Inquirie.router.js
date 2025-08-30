const control = require('../Controls/Inquirie.controls');
const express = require('express');
const verifyToken = require('../Middlewares/verifyToken');
const router = express.Router();

router.post('/addInquirie' , verifyToken , control.addInquirie);
router.patch('/addRes/:inquirieId' , verifyToken , control.addRes)

module.exports = router;