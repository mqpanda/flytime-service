import express from 'express';
import { registerAccount } from '../controllers/AccountController.js';

const router = express.Router();

router.post('/api/register', registerAccount);

export default router;
