import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { AirlineController } from '../controllers/index.js';

const router = express.Router();

router.post(
  '/api/admin-panel',
  checkAuth,
  checkUserRole(['admin']),
  AirlineController.createAirline
);

export default router;
