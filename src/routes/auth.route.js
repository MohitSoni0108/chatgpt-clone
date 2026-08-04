import express from 'express';
import {signup , login , logout} from "../controllers/auth.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();
//api endpoint : post /api/auth/signup
router.post("/signup", signup );
//api endpoint : post  /api/auth/login
router.post("/login", login);


//protected routes
router.post("/logout",authenticateUser,logout);

export default router;