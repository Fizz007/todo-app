import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema); 