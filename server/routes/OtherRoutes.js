import express from 'express';
import Airport from '../models/Airport.js';
import Aircraft from '../models/Aircraft.js';
import City from '../models/City.js';
import Country from '../models/Country.js';
import Airline from '../models/Airline.js';

const router = express.Router();

// Airport routes
router.get('/airports', async (req, res) => {
  try {
    const airports = await Airport.find().populate('city');
    res.json(airports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/airports', async (req, res) => {
  const airport = new Airport({
    name: req.body.name,
    code: req.body.code,
    city: req.body.city,
  });

  try {
    const newAirport = await airport.save();
    res.status(201).json(newAirport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Aircraft routes
router.get('/aircrafts', async (req, res) => {
  try {
    const aircrafts = await Aircraft.find().populate('airline');
    res.json(aircrafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/aircrafts', async (req, res) => {
  const aircraft = new Aircraft({
    model: req.body.model,
    manufacturer: req.body.manufacturer,
    capacity: req.body.capacity,
    airline: req.body.airline,
  });

  try {
    const newAircraft = await aircraft.save();
    res.status(201).json(newAircraft);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// City routes
router.get('/cities', async (req, res) => {
  try {
    const cities = await City.find().populate('country');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cities', async (req, res) => {
  const city = new City({
    name: req.body.name,
    country: req.body.country,
  });

  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Country routes
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/countries', async (req, res) => {
  const country = new Country({
    name: req.body.name,
  });

  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Airline routes
router.get('/airlines', async (req, res) => {
  try {
    const airlines = await Airline.find().populate('country');
    res.json(airlines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/airlines', async (req, res) => {
  const airline = new Airline({
    name: req.body.name,
    country: req.body.country,
  });

  try {
    const newAirline = await airline.save();
    res.status(201).json(newAirline);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
// РОУТЫ С ВСТРОЕННЫМИ КОНТРОЛЛЕРАМИ
