

import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  username: string;
  userType: 'Admin' | 'Client' | 'Vendor';
  phoneNumber?: number;
  firstname?: string;
  lastname?: string;
  imageUrl: string;
  isVerified?: boolean;
  verificationToken?: string;
  password: string;
  blocked?: boolean;
  googleId?: string;
  facebookId?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    // required: true,
    enum: ['Admin', 'Client', 'Vendor'],
  },
  phoneNumber: {
    type: Number,
    default: +21697009028,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  imageUrl: {
    type: String,
    // required: true,
    default: 'https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  password: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  googleId: { type: String, 
    // unique: true,
    default: "idgoogleee",
     sparse: true }, // Ensure sparse index if you want to allow multiple nulls

  facebookId: {
    type: String,
    default: "idfacebookkk",
    // unique: true,
    sparse:true
  },
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
export type { IUser };