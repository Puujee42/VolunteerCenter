import { FaMedal, FaClipboardList, FaHandsHelping, FaChartPie, FaLightbulb } from 'react-icons/fa';
import { IconType } from 'react-icons';

// --- Type Definitions ---
export interface RankData {
  rank: string;
  progress: number;
  rankIcon: IconType;
}

export interface HistoryItem {
  date: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface Strength {
  skill: string;
  value: number;
}

export interface Recommendation {
  title: string;
  description: string;
  icon: IconType;
}


// --- Exported Data ---
export const rankData: RankData = {
  rank: 'Gold',
  progress: 75,
  rankIcon: FaMedal,
};

export const volunteeringHistory: HistoryItem[] = [
  { 
    date: 'October 2025', 
    title: 'Community Cleanup', 
    description: 'Organized and led a team of 20 volunteers for a city-wide park cleanup.', 
    icon: FaClipboardList 
  },
  { 
    date: 'July 2025', 
    title: 'Mentorship Program Kickstart', 
    description: 'Mentored two junior members, helping them onboard and define their career goals.', 
    icon: FaHandsHelping 
  },
  { 
    date: 'March 2025', 
    title: 'Charity Fundraising Event', 
    description: 'Helped raise over $5,000 for a local animal shelter by managing logistics.', 
    icon: FaChartPie 
  },
];

export const strengths: Strength[] = [
  { skill: 'Leadership', value: 90 },
  { skill: 'Teamwork', value: 85 },
  { skill: 'Communication', value: 80 },
  { skill: 'Creativity', value: 75 },
  { skill: 'Problem Solving', value: 70 },
  { skill: 'Adaptability', value: 95 },
];

export const recommendations: Recommendation[] = [
  { 
    title: 'Advanced Leadership Workshop', 
    description: 'Enhance your proven leadership skills with our advanced weekend workshop.', 
    icon: FaLightbulb 
  },
  { 
    title: 'Join the Mentorship Committee', 
    description: 'Your experience is valuable. Help shape the future of our mentorship program.', 
    icon: FaHandsHelping 
  },
];
export interface Activity {
  id: number;
  date: string; // ISO string format: "YYYY-MM-DD"
  category: 'Volunteering' | 'Workshop' | 'Mentorship';
  title: string;
  points: number;
}

// Add some sample activities spread across different dates
export const userActivities: Activity[] = [
  { id: 1, date: '2025-10-28', category: 'Volunteering', title: 'Community Cleanup', points: 20 },
  { id: 2, date: '2025-10-15', category: 'Workshop', title: 'Advanced Leadership Workshop', points: 15 },
  { id: 3, date: '2025-09-05', category: 'Mentorship', title: 'Mentored a junior member', points: 25 },
  { id: 4, date: '2025-07-20', category: 'Volunteering', title: 'Fundraising Event', points: 20 },
  { id: 5, date: '2025-03-10', category: 'Workshop', title: 'Public Speaking Masterclass', points: 15 },
  // Add more data points as needed
];
export interface Opportunity {
  id: string;
  title: string;
  cause: 'Environment' | 'Community' | 'Education' | 'Animals';
  location: string;
  date: string;
  description: string;
  skills: string[];
  slots: {
    filled: number;
    total: number;
  };
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp1',
    title: 'City Park Beautification',
    cause: 'Environment',
    location: 'Central Park',
    date: 'November 15, 2025',
    description: 'Help us plant new trees and clean up the park grounds for the community.',
    skills: ['Gardening', 'Teamwork'],
    slots: { filled: 18, total: 25 },
  },
  {
    id: 'opp2',
    title: 'Animal Shelter Support',
    cause: 'Animals',
    location: 'Happy Paws Shelter',
    date: 'November 22, 2025',
    description: 'Assist with feeding, cleaning, and walking sheltered animals.',
    skills: ['Animal Care', 'Patience'],
    slots: { filled: 5, total: 10 },
  },
  {
    id: 'opp3',
    title: 'Youth Tutoring Session',
    cause: 'Education',
    location: 'Community Center',
    date: 'November 29, 2025',
    description: 'Provide homework help and mentorship to elementary school students.',
    skills: ['Teaching', 'Communication'],
    slots: { filled: 8, total: 8 }, // This one is full
  },
];