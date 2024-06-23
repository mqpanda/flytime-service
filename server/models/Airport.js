import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Airport = mongoose.model('Airport', airportSchema);

export default Airport;
