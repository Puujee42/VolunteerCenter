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

// 2. A TypeScript interface for the Podcast document.
export interface IPodcast extends Document {
  podcastId: number;
  episodeNumber: number;
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  duration: string;
  date: Date;
  cover: string;
  audioSrc: string;
}

// 3. The main Mongoose schema for a Podcast episode.
const PodcastSchema: Schema = new Schema({
  // Using 'podcastId' for your custom numeric ID.
  podcastId: {
    type: Number,
    required: true,
    unique: true,
  },
  
  // Storing the episode number separately for easy sorting and display.
  episodeNumber: {
    type: Number,
    required: true,
    unique: true, // Assuming each episode number is unique.
  },
  
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  description: {
    type: BilingualSchema,
    required: true,
  },
  
  duration: {
    type: String,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  cover: {
    type: String,
    required: true, // URL or path to the cover image.
  },
  
  audioSrc: {
    type: String,
    required: true, // URL or path to the audio file.
  },
}, {
  // Automatically manage `createdAt` and `updatedAt` timestamps.
  timestamps: true,
});

// 4. Export the model, ensuring compatibility with Next.js hot-reloading.
export default models.Podcast || mongoose.model<IPodcast>('Podcast', PodcastSchema);