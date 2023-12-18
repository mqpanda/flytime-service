import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'air carrier', 'admin'],
      default: 'user',
    },
    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger',
      },
    ],
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model('Account', accountSchema);

export default Account;
