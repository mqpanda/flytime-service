import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 7000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Server started on port ${PORT}`);
});
