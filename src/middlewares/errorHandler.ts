import { ErrorRequestHandler } from "express";

export const requestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
        error: (err.message || 'An error occured.'),
    });
};