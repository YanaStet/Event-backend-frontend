import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';

export const userRegister = async (req, res) => {
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
};

export const userLogin = async (req, res) => {
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
};

export const userMe = async (req, res) => {
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
};