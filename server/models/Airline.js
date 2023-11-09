import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema({
  airline_name: String,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
});

const Airline = mongoose.model('Airline', airlineSchema);

export default Airline;
