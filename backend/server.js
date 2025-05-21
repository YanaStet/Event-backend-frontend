import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';

import {registerValidator, loginValidator, postCreateValidator} from './validations.js';

import UserModel from './models/user.js'
import checkAuth from './utils/checkAuth.js';

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
.connect('mongodb+srv://yanastetforcomp:YANA2580@cluster0.s2lmenk.mongodb.net/user')
.then(() => console.log('DB ok'))
.catch(err => console.log("DB error", err));

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d',
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося зареєструватися',
        });
    }
});

app.post('/auth/login', loginValidator, async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: "Користувач не знайдений"
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(404).json({
                message:"Неправильний логін або пароль"
            });
        }

        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d',
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалося залогіниться',
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({
                message: "Користувач не знайдений"
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'немає доступу',
        });
    }
});



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});