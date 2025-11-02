import mongoose, { Schema, Document, models } from 'mongoose';

// 1. A reusable schema for bilingual text fields.
// This keeps our main schema clean and easy to read.
const BilingualSchema = new Schema({
  mn: { 
    type: String, 
    required: [true, 'Mongolian text is required.'] 
  },
  en: { 
    type: String, 
    required: [true, 'English text is required.'] 
  },
}, { _id: false }); // We don't need a separate _id for this sub-document.

// 2. A TypeScript interface for type safety in our application.
export interface ICourse extends Document {
  courseId: string; // The unique string ID like "skill-based"
  category: { mn: string; en: string };
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  date: Date;
  duration: { mn: string; en: string };
  enrollLink: string;
  thumbnail: string;
}

// 3. The main Mongoose schema for a Course document.
const CourseSchema: Schema = new Schema({
  // Using 'courseId' for your custom string ID to avoid conflicts with Mongoose's virtual 'id'.
  courseId: {
    type: String,
    required: true,
    unique: true, // This should be a unique identifier for each course.
  },
  
  category: {
    type: BilingualSchema,
    required: true,
  },
  
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  description: {
    type: BilingualSchema,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  duration: {
    type: BilingualSchema,
    required: true,
  },
  
  enrollLink: {
    type: String,
    required: true,
  },
  
  thumbnail: {
    type: String,
    required: true,
  },
}, {
  // Automatically adds `createdAt` and `updatedAt` fields.
  timestamps: true,
});

// 4. Export the model, making it compatible with Next.js hot-reloading.
export default models.Course || mongoose.model<ICourse>('Course', CourseSchema);