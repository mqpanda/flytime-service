import mongoose from 'mongoose';

const aircraftSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airline',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Aircraft = mongoose.model('Aircraft', aircraftSchema);

export default Aircraft;
