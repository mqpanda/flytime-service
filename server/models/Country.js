import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  airline_name: String,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
});

const Country = mongoose.model('Country', countrySchema);

export default Country;
