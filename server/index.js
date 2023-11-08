import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import accountRoutes from './routes/AccountRoutes.js';
import PassengerRoutes from './routes/PassengerRoutes.js';
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

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

const PORT = process.env.PORT || 7001;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Server started on port ${PORT}`);
});
