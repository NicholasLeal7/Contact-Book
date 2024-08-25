import { RequestHandler } from "express";
import z from 'zod';
import sharp from 'sharp';
import { unlink } from 'fs/promises';
import * as userService from '../services/userService';
import { findUserById } from "../services/userService";
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const addImage = async (path: string, filename: string) => {
    const name: string = Math.floor(Math.random() * 1000) + filename + '.jpg';
    await sharp(path)
        .resize(100, 100, { fit: 'cover' })
        .toFile('./public/media/' + name);
    await unlink(path);
    return name;
};

const getIdByAuthorization = (authorization: string | undefined) => {
    if (!authorization || authorization.split(" ")[0] != 'Bearer') return false;
    const payload: any = JWT.verify(authorization.split(" ")[1], process.env.JWT_SECRET_KEY as string);
    return parseInt(payload.id);
};

export const updateUser: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not allowed!', status: 401 });

    const updateSchema = z.object({
        name: z.string().min(3).max(100).optional(),
        email: z.string().email().max(100).optional(),
        phone: z.string().max(100).optional(),
        password: z.string().max(100).optional(),
        photo_url: z.string().optional()
    });

    const body = updateSchema.safeParse(req.body);

    if (!body.success) return next({ message: 'Invalid data!', status: 403 });

    if (body.data.password) {
        body.data.password = bcrypt.hashSync(body.data.password, 10);
    }

    body.data.photo_url = user.photo_url;
    if (req.file) {
        body.data.photo_url = await addImage(req.file.path, req.file.filename);
    }

    const updatedUser = await userService.update(user.user_id, body.data);
    if (updatedUser) return res.status(200).json({ user: updatedUser });

    return next({ message: 'An error occured!', status: 500 });
};