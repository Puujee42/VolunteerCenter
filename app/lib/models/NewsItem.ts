import mongoose, { Schema, Document, models } from 'mongoose';

// 1. A reusable schema for bilingual text fields { mn, en }.
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

// 2. A TypeScript interface for type safety in your application code.
export interface INewsItem extends Document {
  newsId: string; // The unique string ID like "hackathon-2022"
  date: Date;
  category: { mn: string; en: string };
  title: { mn: string; en: string };
  imageUrl: string;
  link: string;
}

// 3. The main Mongoose schema for a NewsItem.
const NewsItemSchema: Schema = new Schema({
  // Using 'newsId' for your custom string ID. It's unique and required.
  newsId: {
    type: String,
    required: true,
    unique: true,
  },
  
  date: {
    type: Date,
    required: true,
  },
  
  category: {
    type: BilingualSchema,
    required: true,
  },
  
  title: {
    type: BilingualSchema,
    required: true,
  },
  
  imageUrl: {
    type: String,
    required: true,
  },
  
  link: {
    type: String,
    required: true,
  },
}, {
  // Automatically manage `createdAt` and `updatedAt` timestamps.
  timestamps: true,
});

// 4. Export the model, ensuring compatibility with Next.js hot-reloading.
export default models.NewsItem || mongoose.model<INewsItem>('NewsItem', NewsItemSchema);