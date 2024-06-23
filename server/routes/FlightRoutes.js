import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { FlightController } from '../controllers/index.js';

const router = express.Router();

router.post(
  '/api/flight',
  checkAuth,
  checkUserRole(['air carrier', 'admin']),
  FlightController.createFlight
);

router.get('/api/flights', FlightController.getFlights);
router.get('/api/flights/result', FlightController.getFlightsByParam);
router.get('/api/flights/:id', FlightController.getFlightById);

export default router;
