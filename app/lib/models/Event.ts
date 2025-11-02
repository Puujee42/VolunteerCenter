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

// A TypeScript interface for our Event document.
export interface IEvent extends Document {
  title: { mn: string; en: string };
  date: Date;
  category: { mn: string; en: string };
  image: string;
  link: string;
}

// The main Mongoose schema for an Event.
const EventSchema: Schema = new Schema({
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  category: {
    type: BilingualSchema,
    required: true,
  },
  
  image: {
    type: String,
    required: true,
  },
  
  link: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Export the model, ensuring Next.js hot-reloading compatibility.
export default models.Event || mongoose.model<IEvent>('Event', EventSchema);