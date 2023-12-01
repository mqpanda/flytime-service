import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { AirlineController } from '../controllers/index.js';

const router = express.Router();

router.post(
  '/api/post/add',
  checkAuth,
  checkUserRole(['admin', 'air carrier'])
  //AirlineController.
);
router.get(
  '/api/post/get',
  checkAuth,
  checkUserRole(['admin', 'air carrier'])
  //AirlineController.
);
router.get(
  '/api/post/get',
  checkAuth,
  checkUserRole(['admin', 'air carrier'])
  //AirlineController.
);



export default router;
