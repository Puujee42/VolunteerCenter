import mongoose, { Schema, Document, models } from 'mongoose';

// 1. Define a reusable schema for the bilingual fields { mn, en }
// This keeps the main schema clean and DRY (Don't Repeat Yourself).
// We set `_id: false` because we don't need separate IDs for these sub-documents.
const BilingualSchema = new Schema({
  mn: { 
    type: String, 
    required: [true, 'Mongolian text is required.'] 
  },
  en: { 
    type: String, 
    required: [true, 'English text is required.'] 
  },
}, { _id: false });

// 2. Define a TypeScript interface for the Activity document
// This provides strong typing in your application code.
export interface IActivity extends Document {
  activityId: number; // Using 'activityId' to avoid conflict with MongoDB's virtual 'id'
  category: { mn: string; en: string };
  title: { mn: string; en: string };
  desc: { mn: string; en: string };
  date: Date;
  location: { mn: string; en: string };
  image: string;
}

// 3. Create the main Mongoose Schema for an Activity
const ActivitySchema: Schema = new Schema({
  // It's better to use a custom name like 'activityId' for your numeric ID
  // to avoid confusion with MongoDB's default '_id' and its virtual 'id' getter.
  activityId: {
    type: Number,
    required: true,
    unique: true, // Ensures each activity has a unique number
  },
  
  category: {
    type: BilingualSchema,
    required: true,
  },
  
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  desc: {
    type: BilingualSchema,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  location: {
    type: BilingualSchema,
    required: true,
  },
  
  image: {
    type: String,
    required: true,
  },
}, {
  // Automatically add `createdAt` and `updatedAt` fields
  timestamps: true,
});

// 4. Export the model
// This pattern prevents Mongoose from recompiling the model on every hot-reload
// in a Next.js development environment.
export default models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);