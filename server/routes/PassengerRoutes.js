import express from 'express';
import { PassengerController } from '../controllers/index.js';
import { checkAuth } from '../middlewares/index.js';

const router = express.Router();

router.post('/api/passenger', checkAuth, PassengerController.createPassenger);
router.get('/api/passenger', checkAuth, PassengerController.getAllPassengers);
router.get(
  '/api/passenger/:passengerId',
  checkAuth,
  PassengerController.getOnePassenger
);
router.delete(
  '/api/passenger/:passengerId',
  checkAuth,
  PassengerController.deletePassenger
);
router.put(
  '/api/passenger/:passengerId',
  checkAuth,
  PassengerController.updatePassenger
);

export default router;
