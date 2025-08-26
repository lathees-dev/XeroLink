import express from 'express';
import { register, login } from '../controllers/authControllers.js';
import { validateLogin } from '../middlewares/validateLogin.js';
import { validateRegistration } from '../middlewares/validateRegistration.js';
const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

export default router;