import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import { checkUserRole } from '../middlewares/roleMiddleware.js';
import { BookingController } from '../controllers/index.js';

const router = express.Router();

router.post('/api/flight/booking', BookingController.bookSeat);
router.get(
  '/api/flights/bookings/:accountId',
  BookingController.getBookingsByAccountId
);
router.get(
  '/api/flights/bookings/occupied-seats/:flightId',
  BookingController.getOccupiedSeatsByFlightId
);

export default router;
