import express from 'express';
import mongoose from 'mongoose';

import {registerValidator, loginValidator, postCreateValidator} from './validations.js';

import UserModel from './models/user.js';
import checkAuth from './utils/checkAuth.js';
import * as postController from './controllers/PostController.js';
import * as userController from './controllers/UserController.js';

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
.connect('mongodb+srv://yanastetforcomp:YANA2580@cluster0.s2lmenk.mongodb.net/user')
.then(() => console.log('DB ok'))
.catch(err => console.log("DB error", err));

app.post('/auth/register', registerValidator, userController.userRegister);
app.post('/auth/login', loginValidator, userController.userLogin);
app.get('/auth/me', checkAuth, userController.userMe);
app.post('/posts', postCreateValidator, postController.create);
app.get('/posts', postController.getAll);

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});