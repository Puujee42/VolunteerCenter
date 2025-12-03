// lib/data.ts
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import { 
  JobOpening, 
  Course, 
  EventItem, 
  VolunteerOpportunity, 
  PodcastEpisode, 
  VideoItem, 
  NewsItem 
} from "./types";

const DB_NAME = "volunteer_db"; // Change to "volunteer_db" or similar if preferred

// Helper to convert MongoDB _id to string
const mapDoc = <T>(doc: any): T => ({
  ...doc,
  _id: doc._id.toString(),
});

// ─────────────────────────────────────────────────────────────
// 1. CAREERS / JOBS
// ─────────────────────────────────────────────────────────────
export async function getJobOpenings() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<JobOpening>("jobs");
  
  // Fetch all jobs
  const jobs = await collection.find({}).toArray();
  
  // Convert ObjectId to string for Next.js
  return jobs.map(job => ({
    ...job,
    _id: job._id.toString(),
  }));
}
// ─────────────────────────────────────────────────────────────
// 2. COURSES (E-Learning)
// ─────────────────────────────────────────────────────────────
export async function getCourses() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<Course>("courses");
  
  // Sort by date ascending (upcoming courses)
  const courses = await collection.find({}).sort({ date: 1 }).toArray();
  return courses.map(mapDoc);
}

export async function getCourseById(slugId: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<Course>("courses");
  
  const course = await collection.findOne({ id: slugId });
  return course ? mapDoc(course) : null;
}

// ─────────────────────────────────────────────────────────────
// 3. EVENTS
// ─────────────────────────────────────────────────────────────
export async function getEvents(limit?: number) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<EventItem>("events");
  
  let cursor = collection.find({}).sort({ startDate: 1 }); // Soonest first
  
  if (limit) {
    cursor = cursor.limit(limit);
  }

  const events = await cursor.toArray();
  return events.map(mapDoc);
}

export async function getEventById(slugId: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<EventItem>("events");
  
  const event = await collection.findOne({ id: slugId });
  return event ? mapDoc(event) : null;
}

// ─────────────────────────────────────────────────────────────
// 4. VOLUNTEER OPPORTUNITIES
// ─────────────────────────────────────────────────────────────
export async function getVolunteerOpportunities(cityFilter?: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<VolunteerOpportunity>("volunteers");
  
  const query = (cityFilter && cityFilter !== 'all') ? { city: cityFilter } : {};
  
  const opportunities = await collection
    .find(query)
    .sort({ addedDate: -1 }) // Newest listed first
    .toArray();

  return opportunities.map(mapDoc);
}

// ─────────────────────────────────────────────────────────────
// 5. NEWS / BLOG
// ─────────────────────────────────────────────────────────────
export async function getNews(limit?: number) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<NewsItem>("news");
  
  let cursor = collection.find({}).sort({ date: -1 }); // Newest first
  
  if (limit) {
    cursor = cursor.limit(limit);
  }

  const news = await cursor.toArray();
  return news.map(mapDoc);
}

// ─────────────────────────────────────────────────────────────
// 6. MEDIA (Podcasts & Videos)
// ─────────────────────────────────────────────────────────────
export async function getPodcasts() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<PodcastEpisode>("podcasts");
  
  const podcasts = await collection.find({}).sort({ date: -1 }).toArray();
  return podcasts.map(mapDoc);
}

export async function getVideos() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<VideoItem>("videos");
  
  const videos = await collection.find({}).sort({ date: -1 }).toArray();
  return videos.map(mapDoc);
}

// ─────────────────────────────────────────────────────────────
// 7. USER DASHBOARD (Activities, History)
// ─────────────────────────────────────────────────────────────
// Assuming a 'users' collection where a user document contains an 'activities' array
// or a separate 'activities' collection linked by userId.
// Here is a simple implementation assuming a separate collection linked by userId.

export interface UserActivity {
  userId: string;
  category: string;
  title: string;
  points: number;
  date: string;
}

export async function getUserActivities(userId: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<UserActivity>("user_activities");
  
  const activities = await collection
    .find({ userId: userId })
    .sort({ date: -1 })
    .toArray();

  return activities.map(mapDoc);
}