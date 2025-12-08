// lib/types.ts
import { ObjectId } from "mongodb";

// --- Helpers ---
export interface BilingualString {
  mn: string;
  en: string;
}
export interface ProgramItem {
  id: string;
  category: string;
  icon: string;
  title: BilingualString;
  description: BilingualString;
  focus: { mn: string[]; en: string[] };
  color: string; // Tailwind classes string
}

export interface ProgramPageData {
  heroTitle: string;
  heroSubtitle: string;
  stats: { label: string; value: string }[];
  categories: { [key: string]: string };
  programs: ProgramItem[];
}
// --- Collections ---

export interface JobOpening {
  _id: string; // MongoDB ID converted to string
  id?: string;
  title: string; // Or BilingualString if titles differ
  department: string;
  location: string;
  type: string;
  description?: BilingualString; // Added for full page details
}

export interface Course {
  _id?: string;
  id: string; // slug id like 'skill-based'
  category: BilingualString;
  title: string | BilingualString; 
  description: string | BilingualString;
  date: string; // ISO "2025-01-25"
  duration: string | BilingualString;
  thumbnail: string;
}

export interface EventItem {
  _id?: string;
  id: string; // slug
  deadline: string; // ISO Date
  startDate: string; // ISO Date "2025-12-28"
  fullDate?: string; 
  imageUrl: string;
  status: 'open' | 'full' | 'ended';
  registered: number;
  capacity: number;
  title: BilingualString;
  location: BilingualString;
}

export interface VolunteerOpportunity {
  _id?: string;
  title: string; // Or BilingualString
  description: string;
  registrationStart: string;
  registrationEnd: string;
  addedDate: string;
  organization: string;
  city: string;
  icon?: string; // Store icon name (e.g. "FaLeaf") string reference
}

export interface PodcastEpisode {
  _id?: string;
  ep: number;
  title: string; // Or BilingualString
  description: string;
  duration: string;
  date: string;
  cover: string;
  audioSrc: string;
}

export interface VideoItem {
  _id?: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoSrc: string;
}

export interface NewsItem {
  _id?: string;
  id: string; // slug
  date: string;
  imageUrl: string;
  category: BilingualString;
  title: BilingualString;
  content?: BilingualString; // Full article content
}