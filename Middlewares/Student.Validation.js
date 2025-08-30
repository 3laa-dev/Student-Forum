const { body } = require('express-validator');

const registerValidation = [
    body('firstName')
        .notEmpty()
        .withMessage('First Name is empty'),
    body('lastName')
        .notEmpty()
        .withMessage('Last Name is empty'),
    body('email')
        .notEmpty()
        .withMessage('Email Name is empty'),
];

module.exports = {
    registerValidation
};