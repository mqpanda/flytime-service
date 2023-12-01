import Passenger from '../models/Passenger.js';
import Account from '../models/Account.js';

export const createPassenger = async (req, res) => {
  try {
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.phone_number ||
      !req.body.passport_id
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    const account = await Account.findById(req.userId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.passengers.length >= 5) {
      return res.status(400).json({ message: 'Passenger limit reached' });
    }

    const passenger = new Passenger({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      passport_id: req.body.passport_id,
      account_id: req.userId,
    });

    const savedPassenger = await passenger.save();

    account.passengers.push(savedPassenger._id);
    await account.save();

    res.status(201).json(savedPassenger);
  } catch (error) {
    console.error('Error creating passenger:', error);
    res.status(500).json({ message: 'Error creating passenger' });
  }
};

export const getOnePassenger = async (req, res) => {
  const passengerId = req.params.passengerId;
  try {
    const account = await Account.findById(req.userId).populate('passengers');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const passenger = account.passengers.find((p) => p._id == passengerId);

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    res.status(200).json(passenger);
  } catch (error) {
    console.error('Error fetching passenger:', error);
    res.status(500).json({ message: 'Error fetching passenger' });
  }
};

export const getAllPassengers = async (req, res) => {
  try {
    const account = await Account.findById(req.userId).populate('passengers');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const passengers = account.passengers;
    res.status(200).json(passengers);
  } catch (error) {
    console.error('Error fetching passengers:', error);
    res.status(500).json({ message: 'Error fetching passengers' });
  }
};

export const deletePassenger = async (req, res) => {
  const passengerId = req.params.passengerId;

  try {
    const account = await Account.findById(req.userId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await Passenger.findByIdAndDelete(passengerId);

    account.passengers = account.passengers.filter(
      (id) => id.toString() !== passengerId
    );

    await account.save();

    res.status(200).json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    console.error('Error deleting passenger:', error);
    res.status(500).json({ message: 'Error deleting passenger' });
  }
};

export const updatePassenger = async (req, res) => {
  const passengerId = req.params.passengerId;

  try {
    const passenger = await Passenger.findById(passengerId);

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    passenger.first_name = req.body.first_name || passenger.first_name;
    passenger.last_name = req.body.last_name || passenger.last_name;
    passenger.phone_number = req.body.phone_number || passenger.phone_number;
    passenger.passport_id = req.body.passport_id || passenger.passport_id;

    const updatedPassenger = await passenger.save();

    res.status(200).json(updatedPassenger);
  } catch (error) {
    console.error('Error updating passenger:', error);
    res.status(500).json({ message: 'Error updating passenger' });
  }
};
