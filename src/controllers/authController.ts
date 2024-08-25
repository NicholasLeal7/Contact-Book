import { RequestHandler } from "express";
import z, { string } from 'zod';
import JWT from 'jsonwebtoken';
import * as userService from '../services/userService';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

dotenv.config();

const addImage = async (path: string, filename: string) => {
    const name: string = Math.floor(Math.random() * 1000) + filename + '.jpg';
    await sharp(path)
        .resize(100, 100, { fit: 'cover' })
        .toFile('./public/media/' + name);
    await unlink(path);
    return name;
};

export const login: RequestHandler = async (req, res, next) => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const body = loginSchema.safeParse(req.body);
    if (!body.success) return next({ message: 'Invalid data!', status: 400 });

    const user = await userService.findUserByEmail(body.data.email);
    if (user && bcrypt.compareSync(body.data.password, user.password)) {
        const payload = { id: user.user_id };
        const token = JWT.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '2h' });

        return res.status(200).json({
            user,
            token
        });
    }

    return next({ message: 'Invalid data!', status: 400 });
};

export const register: RequestHandler = async (req, res, next) => {
    const registerSchema = z.object({
        name: z.string().min(3),
        phone: z.string(),
        email: z.string().email(),
        password: z.string().transform(value => bcrypt.hashSync(value, 10)),
        photo_url: z.string().default('')
    });

    const body = registerSchema.safeParse(req.body);
    if (!body.success) return next({ message: 'Invalid data!', status: 400 });

    const email = await userService.findUserByEmail(body.data.email);
    if (email) return next({ message: 'This email is already registered!', status: 400 });

    if (req.file) {
        body.data.photo_url = await addImage(req.file.path, req.file.filename);
    }
    const newUser = await userService.createUser(body.data);
    if (newUser) {
        const payload = { id: newUser.user_id };
        const token = JWT.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '2h' });

        return res.status(201).json({
            user: newUser,
            token
        });
    }

    return next({ message: 'An error occured', status: 500 });
};

export const logoff: RequestHandler = (req, res) => {
    res.status(200).json({
        logoff: true,
        message: 'Please, remove the token from local storage.'
    });
};