import bcrypt from 'bcrypt';
import Account from '../models/Account.js';
import jwt from 'jsonwebtoken';

import * as dotenv from 'dotenv';

dotenv.config();

export const registerAccount = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({ email: req.body.email });

    if (existingAccount) {
      return res.status(409).json({
        message: 'Account with this email already exists',
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new Account({
      email: req.body.email,
      passwordHash: hash,
    });

    const account = await doc.save();

    const token = jwt.sign(
      {
        _id: account._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d',
      }
    );

    const { accountData } = account._doc;

    res.json({
      ...accountData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'registration failed',
    });
  }
};
