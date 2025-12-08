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
  NewsItem,
  ProgramItem // <--- Added this import
} from "./types";

const DB_NAME = "volunteer_db"; 

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
  
  const jobs = await collection.find({}).toArray();
  
  return jobs.map(mapDoc);
}

// ─────────────────────────────────────────────────────────────
// 2. COURSES (E-Learning)
// ─────────────────────────────────────────────────────────────
export async function getCourses() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<Course>("courses");
  
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
  
  let cursor = collection.find({}).sort({ startDate: 1 }); 
  
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
    .sort({ addedDate: -1 }) 
    .toArray();

  return opportunities.map(mapDoc);
}

// ─────────────────────────────────────────────────────────────
// 5. NEWS / BLOG
// ─────────────────────────────────────────────────────────────
export async function getNews(limit?: number) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<NewsItem>("news");
  
  let cursor = collection.find({}).sort({ date: -1 }); 
  
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
// 7. USER DASHBOARD
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 8. PROGRAMS
// ─────────────────────────────────────────────────────────────
export async function getPrograms() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<ProgramItem>("programs");
  
  // We generally just want all programs to display on the page
  const programs = await collection.find({}).toArray();
  
  return programs.map(mapDoc);
}
export async function getProgramById(slugId: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection<ProgramItem>("programs");
  
  const program = await collection.findOne({ id: slugId });
  return program ? mapDoc(program) : null;
}