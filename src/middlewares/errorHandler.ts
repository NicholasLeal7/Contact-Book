import { ErrorRequestHandler } from "express";

export const requestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.json({
        error: 'Ocorreu um erro'
    });
};