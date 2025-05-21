import {body} from 'express-validator';

export const registerValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 5}),
    body('fullName', "Некоректне ім'я").isLength({min: 3}),
];

export const loginValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 5})
];

export const postCreateValidator = [
    body('email', 'Некоректний email').isEmail(),
    body('fullName', "Некоректне ім'я").isLength({min: 3}),
    body('descr', "Некоректний опис").isLength({min: 10}).isString(),
];