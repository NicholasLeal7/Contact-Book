import { RequestHandler } from "express";
import z from 'zod';
import sharp from 'sharp';
import { unlink } from 'fs/promises';
import * as contactService from '../services/contactService';
import { findUserById } from "../services/userService";
import JWT from 'jsonwebtoken';

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

export const getAllContacts: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not allowed!', status: 401 });

    const contacts = await contactService.getAll(user.user_id);

    return res.status(200).json({ contacts });
};

export const getOneContact: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not founded!', status: 401 });

    const contact = await contactService.getOne(user.user_id, parseInt(req.params.contact_id));

    return res.status(200).json({ contact });
};

export const addContact: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not founded!', status: 401 });

    const contactSchema = z.object({
        name: z.string().min(3).max(100),
        phone: z.string().max(100),
        email: z.string().email().max(100),
        photo_url: z.string().default('')
    });

    const body = contactSchema.safeParse(req.body);
    if (!body.success) return next({ message: 'Invalid data!', status: 400 });

    if (req.file) {
        body.data.photo_url = await addImage(req.file.path, req.file.filename);
    }
    const newContact = await contactService.add({
        ...body.data,
        user_id: user.user_id
    });
    if (newContact) return res.status(201).json({ contact: newContact });

    return next({ message: 'An error occured', status: 500 });
};

export const updateContact: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not founded!', status: 401 });

    const contact = await contactService.getOne(user.user_id, parseInt(req.params.contact_id));
    if (!contact) return next({ message: 'Contact not allowed!', status: 400 });

    const updateSchema = z.object({
        name: z.string().min(3).max(100).optional(),
        email: z.string().email().max(100).optional(),
        phone: z.string().max(100).optional(),
        photo_url: z.string().optional()
    });

    const body = updateSchema.safeParse(req.body);

    if (!body.success) return next({ message: 'Invalid data!', status: 403 });

    body.data.photo_url = contact.photo_url;
    if (req.file) {
        body.data.photo_url = await addImage(req.file.path, req.file.filename);
    }

    const updatedContact = await contactService.update(contact.contact_id, body.data);
    if (updatedContact) return res.status(200).json({ contact: updatedContact });

    return next({ message: 'An error occured!', status: 500 });
};

export const deleteContact: RequestHandler = async (req, res, next) => {
    const user_id: number | false = getIdByAuthorization(req.headers.authorization);
    if (!user_id) return next({ message: 'Authorization error!', status: 401 });

    const user = await findUserById(user_id);
    if (!user) return next({ message: 'User not allowed!', status: 401 });

    const contact = await contactService.getOne(user.user_id, parseInt(req.params.contact_id));
    if (!contact) return next({ message: 'Contact not allowed!', status: 400 });

    const deletedUser = await contactService.remove(user.user_id, contact.contact_id);
    if (deletedUser) return res.status(200).json({ deleted: true });

    return next({ message: 'An error occured.', status: 500 });
};