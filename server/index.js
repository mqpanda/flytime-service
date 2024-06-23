import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import accountRoutes from './routes/AccountRoutes.js';
import PassengerRoutes from './routes/PassengerRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import AirCarrierRoutes from './routes/AirCarrierRoutes.js';
import FlightRoutes from './routes/FlightRoutes.js';
import BookingRoutes from './routes/BookingRoutes.js';
import OtherRoutes from './routes/OtherRoutes.js';

dotenv.config();

// Запуск DB: mongod --dbpath ~/data/db

const app = express();

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Server uploaded files statically

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error(`DB connection error: ${error}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(accountRoutes);
app.use(PassengerRoutes);
app.use(AdminRoutes);
app.use(AirCarrierRoutes);
app.use(FlightRoutes);
app.use(BookingRoutes);
app.use(OtherRoutes);

const PORT = process.env.PORT || 7001;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Server started on port ${PORT}`);
});
