import mongoose, { Schema, Document, models } from 'mongoose';

// A reusable schema for bilingual text fields.
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

// A TypeScript interface for our Stat document.
export interface IStat extends Document {
  icon: string;
  value: number;
  label: { mn: string; en: string };
  suffix: string;
  displayOrder: number;
}

// The main Mongoose schema for a Stat.
const StatSchema: Schema = new Schema({
  // Note: The 'icon' is stored as a string (e.g., "FaUsers").
  // Your front-end code will map this string to the actual React component.
  icon: {
    type: String,
    required: true,
  },
  
  value: {
    type: Number,
    required: true,
  },
  
  label: {
    type: BilingualSchema,
    required: true,
  },
  
  suffix: {
    type: String,
    default: "",
  },

  // A field to control the order in which stats are displayed on the front-end.
  displayOrder: {
    type: Number,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Export the model, ensuring Next.js hot-reloading compatibility.
export default models.Stat || mongoose.model<IStat>('Stat', StatSchema);