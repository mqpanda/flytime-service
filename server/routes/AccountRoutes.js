import express from 'express';
import { AccountController } from '../controllers/index.js';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/api/admin', checkAuth);

router.post('/api/register', AccountController.registerAccount);
router.post('/api/login', AccountController.loginAccount);
router.get(
  '/api/me',
  checkAuth,
  checkUserRole(['user', 'air carrier', 'admin']),
  AccountController.getMe
);
router.get('/api/admin', checkAuth, checkUserRole(['admin']), (res) => {
  res.json({ message: 'Доступ разрешен для администратора' });
});

export default router;
