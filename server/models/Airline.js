import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema({
  airline_name: { type: String, required: true },
  country: { type: String, required: true },
});

const Airline = mongoose.model('Airline', airlineSchema);

export default Airline;
