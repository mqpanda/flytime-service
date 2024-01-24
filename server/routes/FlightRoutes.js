import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { FlightController } from '../controllers/index.js';

const router = express.Router();

router.post(
  '/api/flight',

  FlightController.createFlight
);

router.get('/api/flights', FlightController.getFlights);
router.get('/api/flights/result', FlightController.getFlightsByParam);

export default router;
