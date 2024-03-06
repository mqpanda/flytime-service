import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, unique: true, required: true },
  aircraft: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  occupiedSeats: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
