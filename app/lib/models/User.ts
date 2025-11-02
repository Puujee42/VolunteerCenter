import mongoose, { Schema, Document, models, Types } from 'mongoose';

// Define the possible ranks using a TypeScript type for better autocompletion.
export type VolunteerRank = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

// 1. Update the TypeScript interface to include the new fields.
export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  age: number;
  province: string;
  district: string;
  program: string;
  rank: VolunteerRank;
  volunteerPoints: number;
  completedOpportunities: Types.ObjectId[]; // Array of IDs referencing VolunteerOpportunity documents
}

// 2. Create the Mongoose Schema with the new fields added.
const UserSchema: Schema = new Schema({
  // --- Existing Fields (Unchanged) ---
  clerkId: {
    type: String,
    required: [true, 'Clerk User ID is required.'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address.'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required.'],
    min: [1, 'Age must be a positive number.'],
  },
  province: {
    type: String,
    required: [true, 'Province is required.'],
  },
  district: {
    type: String,
    required: [true, 'District is required.'],
  },
  program: {
    type: String,
    required: [true, 'Program is required.'],
  },
  
  // --- NEW: Volunteer Ranking and History System ---

  // Field for the user's current rank.
  rank: {
    type: String,
    // `enum` ensures that only these specific values can be saved.
    enum: ['Bronze', 'Silver', 'Gold', 'Diamond'],
    // Every new user starts at the 'Bronze' rank.
    default: 'Bronze',
  },

  // A points system to determine ranking.
  volunteerPoints: {
    type: Number,
    // New users start with 0 points.
    default: 0,
    // Adding an index can speed up queries for leaderboards.
    index: true,
  },

  // An array to store the IDs of completed volunteer opportunities.
  completedOpportunities: [{
    // This tells Mongoose that each item in the array is a MongoDB ObjectId.
    type: Schema.Types.ObjectId,
    // This creates a reference to your `VolunteerOpportunity` model.
    // This is crucial for populating the data later.
    ref: 'VolunteerOpportunity',
  }],
  
}, {
  // Add timestamps (`createdAt`, `updatedAt`)
  timestamps: true, 
});

// Export the model
export default models.User || mongoose.model<IUser>('User', UserSchema);