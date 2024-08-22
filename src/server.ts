import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { requestErrorHandler } from './middlewares/errorHandler';
import { requestIntercepter } from './middlewares/requestIntercepter';
import http from 'http';
import mainRoutes from './routes';

dotenv.config();

const app = express();

//basic server configurations 
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(requestIntercepter);

//routes
app.get("/ping", (req, res) => res.json({ pong: true }));
app.use("/", mainRoutes);

//error handler
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