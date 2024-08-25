import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { requestErrorHandler } from './middlewares/errorHandler';
import { requestIntercepter } from './middlewares/requestIntercepter';
import http from 'http';
import mainRoutes from './routes';
import passport from 'passport';

dotenv.config();

const app = express();

//basic server configurations 
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(requestIntercepter);
app.use(passport.initialize());

//routes
app.get("/ping", (req, res) => res.status(200).json({ pong: true }));
app.use("/", mainRoutes);

//error handler and not founded
app.use((req, res) => res.status(404).json({ error: 'Route not founded!' }));
app.use(requestErrorHandler);

//server's run configurations
const regularServer = http.createServer(app);
const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`Server running at PORT ${port}`);
    });
};
if (process.env.NODE_ENV === 'production') {
    // TODO: production environment
} else {
    const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    runServer(port, regularServer);
}