import {
    body
} from 'express-validator';

export const loginValidation = [
    body('username')
    .isString().withMessage('Username must be a string')
    .matches(/^[\w.@+-]+$/).withMessage('Username can only contain letters, digits, and @/./+/-/_')
    .isLength({
        max: 150
    }).withMessage('Username must be less than 150 characters'),
    body('password')
    .isString().withMessage('Password must be a string')
    .isLength({
        min: 8,
        max: 128
    }).withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter and one digit'),
];

export const registerValidation = [
    body('username')
    .isString().withMessage('Username must be a string')
    .matches(/^[\w.@+-]+$/).withMessage('Username can only contain letters, digits, and @/./+/-/_')
    .isLength({
        max: 150
    }).withMessage('Username must be less than 150 characters'),
    body('password')
    .isString().withMessage('Password must be a string')
    .isLength({
        min: 8,
        max: 128
    }).withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter and one digit'),
    body('firstName')
    .isString().withMessage('First name must be a string')
    .isLength({
        min: 3
    }).withMessage('First name must be more than 3 characters'),
    body('lastName')
    .isString().withMessage('Last name must be a string')
    .isLength({
        min: 3
    }).withMessage('Last name must be more than 3 characters'),
];
