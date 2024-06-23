import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }, // Ссылка на рейс
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }, // Ссылка на пассажира
  seatNumber: { type: String, required: true },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  }, 
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
