import {body} from 'express-validator';

export const registerValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 8}),
    body('fullName', "Некоректне ім'я").isLength({min: 3}),
];

export const loginValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 8})
];

export const postCreateValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('fullName', "Некоректне ім'я").isLength({min: 3}),
];