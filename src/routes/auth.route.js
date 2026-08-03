import express from 'express';
import {signup , login} from "../controllers/auth.controller.js";


const router = express.Router();
//api endpoint : post /api/auth/signup
router.post("/signup", signup );
//api endpoint : post  /api/auth/login
router.post("/login", login);

export default router;