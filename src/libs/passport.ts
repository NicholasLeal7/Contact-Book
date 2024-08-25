import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { RequestHandler } from "express";
import { findUserById } from "../services/userService";

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string
};

const notAuthorizedJson = {
    message: 'Not Allowed',
    status: 401
};

passport.use(new JWTStrategy(options, async (payload, done) => {
    const user = await findUserById(parseInt(payload.id));
    return user ? done(null, user) : done(notAuthorizedJson, false);
}));

export const privateRoute: RequestHandler = async (req, res, next) => {
    passport.authenticate('jwt', (err: any, user: any) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })(req, res, next);
};

