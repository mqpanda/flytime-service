import express from 'express';
import { AccountController } from '../controllers/index.js';
import { checkAuth } from '../middlewares/index.js';

const router = express.Router();

router.post('/api/register', AccountController.registerAccount);
router.post('/api/login', AccountController.loginAccount);
router.get('/api/me', checkAuth, AccountController.getMe);

export default router;
