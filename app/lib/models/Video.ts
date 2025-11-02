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

// 2. A TypeScript interface for the Video document for type safety.
export interface IVideo extends Document {
  videoId: number;
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  speaker: { mn: string; en: string };
  date: Date;
  duration: string;
  thumbnail: string;
  videoSrc: string;
}

// 3. The main Mongoose schema for a Video.
const VideoSchema: Schema = new Schema({
  // Using 'videoId' for your custom numeric ID.
  videoId: {
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
  
  speaker: {
    type: BilingualSchema,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  duration: {
    type: String,
    required: true,
  },
  
  thumbnail: {
    type: String,
    required: true, // URL or path to the thumbnail image.
  },
  
  videoSrc: {
    type: String,
    required: true, // URL to the video source (e.g., YouTube embed link).
  },
}, {
  // Automatically manage `createdAt` and `updatedAt` timestamps.
  timestamps: true,
});

// 4. Export the model, ensuring compatibility with Next.js hot-reloading.
export default models.Video || mongoose.model<IVideo>('Video', VideoSchema);