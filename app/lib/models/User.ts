import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { IRank, rankSchema, IHistoryItem, historyItemSchema, IStrength, strengthSchema } from './Volunteer'; // Assuming the file is named Volunteer.ts

// Define the main User interface
export interface IUser extends Document {
  clerkId: string; // Or your primary user identifier
  firstName: string;
  lastName: string;
  email: string;
  // --- Embedded Volunteer Data ---
  rankProfile: IRank;
  strengths: IStrength[];
  volunteeringHistory: IHistoryItem[];
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // --- Nesting the schemas from the other file ---
  rankProfile: { type: rankSchema, default: () => ({}) },
  strengths: [strengthSchema],
  volunteeringHistory: [historyItemSchema],

}, { timestamps: true });

// Create and export the User model
export const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);