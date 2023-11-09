import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aircraft',
  },
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
