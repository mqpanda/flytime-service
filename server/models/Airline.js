import mongoose from 'mongoose';

const airlineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Airline = mongoose.model('Airline', airlineSchema);

export default Airline;
