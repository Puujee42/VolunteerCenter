import { getJobOpenings } from "@/lib/mongo/data";
import CareersClient from "./CareersClient";

// Prevents Next.js from caching the DB result indefinitely so users see new jobs immediately
export const dynamic = "force-dynamic"; 

export default async function CareersPage() {
  // 1. Fetch data directly from MongoDB logic (Server Side)
  const rawJobs = await getJobOpenings();

  // 2. Serialize the data
  // Next.js cannot pass MongoDB 'ObjectId' or 'Date' objects directly to Client Components.
  // We must convert them to strings or numbers (JSON serializable types).
  const jobs = rawJobs.map((job: any) => ({
    ...job,
    _id: job._id.toString(), // Convert ObjectId to string
    // If your DB has dates (e.g., createdAt), convert them too:
    // createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
  }));

  // 3. Pass data to the Client Component
  // Note: Prop name 'dbJobs' matches the interface in CareersClient
  return <CareersClient dbJobs={jobs} />;
}