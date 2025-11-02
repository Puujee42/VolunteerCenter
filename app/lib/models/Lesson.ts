import mongoose, { Schema, Document, models } from 'mongoose';

// 1. A reusable schema for bilingual text fields to keep the code DRY.
const BilingualSchema = new Schema({
  mn: { 
    type: String, 
    required: [true, 'Mongolian text is required.'] 
  },
  en: { 
    type: String, 
    required: [true, 'English text is required.'] 
  },
}, { _id: false }); // No separate _id needed for this sub-document.

// 2. A TypeScript interface for type safety when working with Lesson documents.
export interface ILesson extends Document {
  lessonId: number;
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  category: { mn: string; en: string };
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  href: string;
}

// 3. The main Mongoose schema for a Lesson.
const LessonSchema: Schema = new Schema({
  // Using 'lessonId' for your custom numeric ID to avoid conflicts with Mongoose's virtual 'id'.
  lessonId: {
    type: Number,
    required: true,
    unique: true,
  },
  
  // Note: Even though the sample data has identical text, the model is
  // correctly designed to hold separate Mongolian and English versions.
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  description: {
    type: BilingualSchema,
    required: true,
  },
  
  category: {
    type: BilingualSchema,
    required: true,
  },
  
  duration: {
    type: String,
    required: true,
  },
  
  // Using an enum is the best practice for fields with a fixed set of options.
  // This ensures data integrity and prevents typos.
  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: '{VALUE} is not a supported difficulty level.',
    },
  },
  
  thumbnail: {
    type: String,
    required: true,
  },
  
  href: {
    type: String,
    required: true,
  },
}, {
  // Automatically manage `createdAt` and `updatedAt` timestamps.
  timestamps: true,
});

// 4. Export the model, ensuring it works seamlessly with Next.js hot-reloading.
export default models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);