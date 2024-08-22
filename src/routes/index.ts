import { Router } from "express";
import * as userController from '../controllers/userController';
import * as contactController from '../controllers/contactController';

const router = Router();

router.post("/register");
router.post("/login");
router.post("/logoff");

router.get("/contacts");
router.get("/contacts/:id");
router.post("/contacts");
router.put("/contacts/:id");
router.delete("/contacts/:id");

export default router;