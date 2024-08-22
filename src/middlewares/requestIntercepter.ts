import { RequestHandler } from "express";

export const requestIntercepter: RequestHandler = (req, res, next) => {
    //console.log("-> GET /contacts/123 {phone: 123123}");
    console.log(`-> ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
};