import mongoose, { Schema, Document, models } from 'mongoose';

// 1. A reusable schema for bilingual text fields.
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

// 2. A TypeScript interface for the Volunteer Opportunity document.
export interface IVolunteerOpportunity extends Document {
  opportunityId: number;
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  registrationStart: Date;
  registrationEnd: Date;
  addedDate: Date;
  organization: { mn: string; en: string };
  enrollLink: string;
  icon: string; // Stored as a string identifier (e.g., "FaLeaf")
  isNew: boolean;
  city: { mn: string; en: string };
}

// 3. The main Mongoose schema for a Volunteer Opportunity.
const VolunteerOpportunitySchema: Schema = new Schema({
  // Using 'opportunityId' for your custom numeric ID.
  opportunityId: {
    type: Number,
    required: true,
    unique: true,
  },
  
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  description: {
    type: BilingualSchema,
    required: true,
  },
  
  registrationStart: {
    type: Date,
    required: true,
  },
  
  registrationEnd: {
    type: Date,
    required: true,
  },

  addedDate: {
    type: Date,
    required: true,
  },

  organization: {
    type: BilingualSchema,
    required: true,
  },
  
  enrollLink: {
    type: String,
    required: true,
  },
  
  // The icon is stored as a string identifier.
  // Your front-end will map this string to the corresponding React component.
  icon: {
    type: String,
    required: true,
  },
  
  isNew: {
    type: Boolean,
    default: false,
  },

  city: {
    type: BilingualSchema,
    required: true,
  },
}, {
  // Automatically manage `createdAt` and `updatedAt` timestamps.
  timestamps: true,
});

// 4. Export the model, ensuring compatibility with Next.js hot-reloading.
export default models.VolunteerOpportunity || mongoose.model<IVolunteerOpportunity>('VolunteerOpportunity', VolunteerOpportunitySchema);