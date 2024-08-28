import { Router } from "express";
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as contactController from '../controllers/contactController';
import { privateRoute } from "../libs/passport";
import multer from "multer";
import path from 'path';

const router = Router();

const upload = multer({
    dest: './tmp'
})

router.post("/register", upload.single('photo_url'), authController.register);
router.post("/login", authController.login);
router.post("/logoff", privateRoute, authController.logoff);

router.get("/user", privateRoute, userController.getUser);
router.put("/user", privateRoute, upload.single("photo_url"), userController.updateUser);

router.get("/contacts", privateRoute, contactController.getAllContacts);
router.get("/contacts/:contact_id", privateRoute, contactController.getOneContact);
router.post("/contacts", privateRoute, upload.single('photo_url'), contactController.addContact);
router.put("/contacts/:contact_id", privateRoute, upload.single('photo_url'), contactController.updateContact);
router.delete("/contacts/:contact_id", privateRoute, contactController.deleteContact);

export default router;