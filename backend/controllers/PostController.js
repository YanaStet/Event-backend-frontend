import { ReturnDocument } from 'mongodb';
import PostModel from '../models/card.js';
import { json } from 'express';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            user: req.body.user,
            email: req.body.email,
        });

        const post = await doc.save();

        res.json(post);
    }   catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Невдалося створити картку",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find();

        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося отримати статті",
        });
    }
};
