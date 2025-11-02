import mongoose, { Schema, Document, model, Model } from 'mongoose';

// ---------------------------------------------------------------- //
// 1. RANK DATA
// For storing a user's current rank and progress.
// This would typically be a subdocument within a User schema.
// ---------------------------------------------------------------- //

// Interface describing the properties of a Rank subdocument
export interface IRank extends Document {
  rank: string;
  progress: number;
  rankIcon: string; // Storing the component name as a string
}

export const rankSchema: Schema<IRank> = new Schema({
  rank: { type: String, required: true, default: 'Bronze' },
  progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
  rankIcon: { type: String, required: true, default: 'FaMedal' },
});


// ---------------------------------------------------------------- //
// 2. HISTORY ITEM
// For logging individual volunteering achievements.
// These could be subdocuments within a User or a separate collection.
// ---------------------------------------------------------------- //

// Interface describing the properties
export interface IHistoryItem extends Document {
  date: Date;
  title: string;
  description: string;
  icon: string; // Storing the component name
}

export const historyItemSchema: Schema<IHistoryItem> = new Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, required: true, default: 'FaClipboardList' },
});


// ---------------------------------------------------------------- //
// 3. STRENGTH
// To represent a user's skills.
// Best used as a subdocument array within a User schema.
// ---------------------------------------------------------------- //

export interface IStrength extends Document {
  skill: string;
  value: number; // Represents proficiency, e.g., out of 100
}

export const strengthSchema: Schema<IStrength> = new Schema({
  skill: { type: String, required: true, trim: true },
  value: { type: Number, required: true, min: 0, max: 100 },
});


// ---------------------------------------------------------------- //
// 4. RECOMMENDATION
// Could be a separate collection that you query to show to users.
// ---------------------------------------------------------------- //

export interface IRecommendation extends Document {
  title: string;
  description: string;
  icon: string;
  // Optional: Add criteria for who should see this recommendation
  // targetSkills: [String];
  // minRank: String;
}

const recommendationSchema: Schema<IRecommendation> = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: 'FaLightbulb' },
}, { timestamps: true });

export const Recommendation: Model<IRecommendation> = mongoose.models.Recommendation || model<IRecommendation>('Recommendation', recommendationSchema);


// ---------------------------------------------------------------- //
// 5. ACTIVITY
// A log of specific actions a user has completed.
// This is perfect for a separate, queryable collection.
// ---------------------------------------------------------------- //

export interface IActivity extends Document {
  userId: Schema.Types.ObjectId; // Link to the user who did the activity
  date: Date;
  category: 'Volunteering' | 'Workshop' | 'Mentorship';
  title: string;
  points: number;
}

const activitySchema: Schema<IActivity> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    category: { type: String, enum: ['Volunteering', 'Workshop', 'Mentorship'], required: true },
    title: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export const Activity: Model<IActivity> = mongoose.models.Activity || model<IActivity>('Activity', activitySchema);


// ---------------------------------------------------------------- //
// 6. OPPORTUNITY
// A standalone collection for available volunteering events.
// ---------------------------------------------------------------- //

export interface IOpportunity extends Document {
  title: string;
  cause: 'Environment' | 'Community' | 'Education' | 'Animals';
  location: string;
  date: Date;
  description: string;
  skills: string[];
  slots: {
    filled: number;
    total: number;
  };
  // To track which users have signed up
  registeredVolunteers: Schema.Types.ObjectId[];
}

const opportunitySchema: Schema<IOpportunity> = new Schema({
    title: { type: String, required: true, trim: true },
    cause: { type: String, enum: ['Environment', 'Community', 'Education', 'Animals'], required: true, index: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    slots: {
        filled: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 1 },
    },
    registeredVolunteers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Opportunity: Model<IOpportunity> = mongoose.models.Opportunity || model<IOpportunity>('Opportunity', opportunitySchema);