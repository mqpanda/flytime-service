import Airline from '../models/Airline.js';

export const createAirline = async (req, res) => {
  try {
    const { airline_name, country } = req.body;

    const existingAirline = await Airline.findOne({ airline_name, country });

    if (existingAirline) {
      return res.status(409).json({
        message: 'Airline with the same name and country already exists',
      });
    }

    const newAirline = new Airline({ airline_name, country });
    const savedAirline = await newAirline.save();

    res.status(201).json({
      message: 'Airline created successfully',
      airline: savedAirline,
    });
  } catch (error) {
    console.error('Error creating airline:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Контролеры для регулирования авиакомпаний
