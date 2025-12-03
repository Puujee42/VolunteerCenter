import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env' });

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const DB_NAME = "volunteeer_db"; // Or your preferred DB name

// ─────────────────────────────────────────────────────────────
// DATA PREPARATION (Merging MN/EN into single docs)
// ─────────────────────────────────────────────────────────────

const jobsData = [
  {
    id: "1",
    title: { mn: "Төслийн менежер", en: "Project Manager" },
    department: "Programs", 
    location: { mn: "Улаанбаатар", en: "Ulaanbaatar" },
    type: { mn: "Бүтэн цаг", en: "Full-time" }
  },
  {
    id: "2",
    title: { mn: "Харилцааны мэргэжилтэн", en: "Communications Specialist" },
    department: "Marketing", 
    location: { mn: "Улаанбаатар", en: "Ulaanbaatar" },
    type: { mn: "Цагийн ажил", en: "Part-time" }
  },
  {
    id: "3",
    title: { mn: "Орон нутгийн зохицуулагч", en: "Regional Field Coordinator" },
    department: "Programs", 
    location: { mn: "Эрдэнэт", en: "Erdenet" },
    type: { mn: "Сайн дурын", en: "Volunteer" }
  },
  {
    id: "4",
    title: { mn: "Тэтгэлэг бичигч", en: "Grant Writer" },
    department: "Fundraising", 
    location: { mn: "Зайнаас", en: "Remote" },
    type: { mn: "Бүтэн цаг", en: "Full-time" }
  }
];

const coursesData = [
  {
    id: "skill-based",
    category: { mn: "Менежмент", en: "Management" },
    title: { mn: "Ур чадварт суурилсан сайн дурын ажилтан", en: "Skill-Based Volunteering" },
    description: { mn: "Сайн дурын ажлын менежмент...", en: "Gain in-depth knowledge..." },
    date: "2025-01-25",
    duration: { mn: "2 цаг", en: "2 hours" },
    thumbnail: "/data.jpg",
  },
  {
    id: "problems",
    category: { mn: "Асуудал шийдвэрлэлт", en: "Problem Solving" },
    title: { mn: "Сайн дурын ажилтанд тулгарах асуудлууд", en: "Challenges for Volunteers" },
    description: { mn: "Бодит кэйс дээр ажиллаж...", en: "Learn to navigate..." },
    date: "2025-03-04",
    duration: { mn: "1 цаг", en: "1 hour" },
    thumbnail: "/data.jpg",
  },
  {
    id: "planning",
    category: { mn: "Төлөвлөлт", en: "Planning" },
    title: { mn: "Жилийн үйл ажиллагааны төлөвлөгөө", en: "Annual Activity Planning" },
    description: { mn: "Үр дүнтэй төлөвлөгөө...", en: "Master the methodology..." },
    date: "2025-04-08",
    duration: { mn: "1.5 цаг", en: "1.5 hours" },
    thumbnail: "/data.jpg",
  },
  {
    id: "child-protection",
    category: { mn: "Хүүхэд хамгаалал", en: "Child Safety" },
    title: { mn: "Хүүхэд хамгаалал ба сайн дурын ажил", en: "Child Protection & Volunteering" },
    description: { mn: "Ёс зүй, аюулгүй байдал...", en: "Essential ethics..." },
    date: "2025-05-08",
    duration: { mn: "3 цаг", en: "3 hours" },
    thumbnail: "/data.jpg",
  },
];

const eventsData = [
  { id: 'future-owner-2022', deadline: '2022-04-10', startDate: '2022-03-25', status: 'ended', registered: 3000, capacity: 3000, title: { mn: '"Ирээдүйн эзэд 2022" Мэргэжил сонголтын аян', en: '"Future Owners 2022" Career Choice Campaign' }, location: { mn: 'Улаанбаатар', en: 'Ulaanbaatar' }, imageUrl: '/data.jpg' },
  { id: 'family-dev-training', deadline: '2021-04-23', startDate: '2021-05-12', status: 'ended', registered: 50, capacity: 50, title: { mn: '"Гэр бүлээ хөгжье" Цахим сургалт', en: '"Develop Your Family" E-Learning Course' }, location: { mn: 'Онлайн', en: 'Online' }, imageUrl: '/data.jpg' },
  { id: 'youth-hackathon-2023', deadline: '2023-09-01', startDate: '2023-09-15', status: 'open', registered: 85, capacity: 120, title: { mn: 'Залуучуудын Инновацийн Хакертон', en: 'Youth Innovation Hackathon' }, location: { mn: 'Технологийн Парк', en: 'Technology Park' }, imageUrl: '/data.jpg' },
  { id: 'volunteer-meetup-2023', deadline: '2023-07-20', startDate: '2023-08-05', status: 'full', registered: 200, capacity: 200, title: { mn: 'Сайн дурынхны уулзалт 2023', en: 'Annual Volunteer Meetup 2023' }, location: { mn: 'Үндэсний цэцэрлэгт хүрээлэн', en: 'National Park' }, imageUrl: '/data.jpg' },
  { id: 'code-for-good-2024', deadline: '2024-10-15', startDate: '2024-11-01', status: 'open', registered: 45, capacity: 100, title: { mn: '"Сайн сайхны төлөө код" Уралдаан', en: '"Code for Good" Competition' }, location: { mn: 'Онлайн', en: 'Online' }, imageUrl: '/data.jpg' },
  { id: 'enviro-cleanup-2024', deadline: '2024-06-01', startDate: '2024-06-10', status: 'open', registered: 150, capacity: 250, title: { mn: 'Байгаль орчныг цэвэрлэх өдөр', en: 'Environmental Cleanup Day' }, location: { mn: 'Туул голын эрэг', en: 'Tuul River Bank' }, imageUrl: '/data.jpg' },
  { id: 'leadership-workshop-2024', deadline: '2024-08-20', startDate: '2024-09-05', status: 'full', registered: 75, capacity: 75, title: { mn: 'Манлайллын ур чадвар хөгжүүлэх сургалт', en: 'Leadership Development Workshop' }, location: { mn: 'Corporate Tower', en: 'Corporate Tower' }, imageUrl: '/data.jpg' },
];

const newsData = [
  { id: 'hackathon-2022', date: '2022-05-09', category: { mn: "Тэмцээн", en: "Competition" }, title: { mn: 'HACKATHON 2022', en: 'HACKATHON 2022' }, imageUrl: '/data.jpg' },
  { id: 'anti-addiction-campaign', date: '2022-04-14', category: { mn: "Аян", en: "Campaign" }, title: { mn: '“ХОРТ ЗУРШЛЫН ЭСРЭГ ХАМТДАА” АЯН', en: '"TOGETHER AGAINST BAD HABITS" Campaign' }, imageUrl: '/data.jpg' },
  { id: 'youth-dev-training', date: '2022-04-13', category: { mn: "Сургалт", en: "Training" }, title: { mn: 'ЗАЛУУЧУУДЫН ЗӨВЛӨЛИЙГ ЧАДАВХЖУУЛАХ НЬ', en: 'Empowering the Youth Development Council' }, imageUrl: '/data.jpg' },
  { id: 'umnugovi-council-meeting', date: '2022-02-24', category: { mn: "Орон нутаг", en: "Local News" }, title: { mn: 'ӨМНӨГОВЬ АЙМГИЙН ЗАЛУУЧУУДЫН ЗӨВЛӨЛ ХУРАЛДЛАА', en: 'Umnugovi Province Youth Council Meeting' }, imageUrl: '/data.jpg' },
  { id: 'top-100-awards', date: '2021-12-01', category: { mn: "Шагнал", en: "Awards" }, title: { mn: '"ШИЛДЭГ 100 ЗАЛУУ" ШАЛГАРУУЛАЛТ', en: '"TOP 100 YOUTH" Selection' }, imageUrl: '/data.jpg' },
];

const volunteersData = [
  { id: 1, title: { mn: "Байгаль орчны цэвэрлэгээ", en: "Environmental Cleanup" }, description: { mn: "Орон нутгийн цэцэрлэгт...", en: "Join us to clean up..." }, registrationStart: "2025-10-01", registrationEnd: "2025-11-01", addedDate: "2025-09-15", organization: "Environmental Agency", icon: "FaLeaf", city: "Ulaanbaatar" },
  { id: 2, title: { mn: "Залуучуудын Инновацийн Хакатон", en: "Youth Innovation Hackathon" }, description: { mn: "Залуу оюун ухаанд...", en: "Mentor young minds..." }, registrationStart: "2025-11-10", registrationEnd: "2025-11-20", addedDate: "2025-10-01", organization: "Tech for Mongolia", icon: "FaUsers", city: "Erdenet" },
  { id: 3, title: { mn: "Олон нийтийн эрүүл мэндийн аян", en: "Community Health Drive" }, description: { mn: "Орон нутгийн...", en: "Assist medical..." }, registrationStart: "2025-09-01", registrationEnd: "2025-09-30", addedDate: "2025-08-20", organization: "Health Department", icon: "FaMask", city: "Darkhan" },
  { id: 4, title: { mn: "Улсын наадмын туслах ажилтан", en: "National Games Support Staff" }, description: { mn: "Улсын хэмжээний...", en: "Help coordinate..." }, registrationStart: "2025-12-01", registrationEnd: "2025-12-15", addedDate: "2025-11-01", organization: "Sports Federation", icon: "FaFutbol", city: "Choibalsan" },
  { id: 5, title: { mn: "Жилийн төлөвлөгөөний хороо", en: "Annual Planning Committee" }, description: { mn: "Бидний ирэх жилийн...", en: "Lend your strategic skills..." }, registrationStart: "2025-11-12", registrationEnd: "2025-12-08", addedDate: "2025-11-10", organization: "VCM Headquarters", icon: "FaQuestionCircle", city: "Ulaanbaatar" },
];

const podcastsData = [
  { ep: 3, title: { mn: "Нийгмийн өөрчлөлтийг бүтээгчид", en: "The Art of Community Organizing" }, description: { mn: "Энэ дугаарт бид...", en: "In this episode..." }, duration: "42 min", date: "2025-10-28", cover: "/data.jpg", audioSrc: "#" },
  { ep: 2, title: { mn: "Сайн дурын ажлын сэтгэл зүй", en: "The Psychology of Volunteering" }, description: { mn: "Бусдад туслахын...", en: "Exploring the mental..." }, duration: "35 min", date: "2025-10-15", cover: "/data.jpg", audioSrc: "#" },
  { ep: 1, title: { mn: "Анхны алхам", en: "Taking the First Step" }, description: { mn: "Сайн дурын ажилтан...", en: "A foundational discussion..." }, duration: "28 min", date: "2025-10-01", cover: "/data.jpg", audioSrc: "#" },
];

const videosData = [
  { title: { mn: "Сайн дурын ажлын нөлөө", en: "The Impact of Volunteering" }, description: { mn: "Бидний үйл ажиллагаа...", en: "A powerful look..." }, speaker: "B. Tsevelmaa", date: "2025-10-20", duration: "12:35", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: { mn: "Төсөл хэрхэн эхлүүлэх вэ?", en: "How to Start a Community Project" }, description: { mn: "Төслийн санаагаа...", en: "A step-by-step guide..." }, speaker: "Kh. Selenge", date: "2025-09-15", duration: "28:10", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_2" },
];

// ─────────────────────────────────────────────────────────────
// SEED EXECUTION
// ─────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);

    // 1. JOBS
    console.log("🌱 Seeding Jobs...");
    await db.collection("jobs").deleteMany({});
    await db.collection("jobs").insertMany(jobsData);

    // 2. COURSES
    console.log("🌱 Seeding Courses...");
    await db.collection("courses").deleteMany({});
    await db.collection("courses").insertMany(coursesData);

    // 3. EVENTS
    console.log("🌱 Seeding Events...");
    await db.collection("events").deleteMany({});
    await db.collection("events").insertMany(eventsData);

    // 4. NEWS
    console.log("🌱 Seeding News...");
    await db.collection("news").deleteMany({});
    await db.collection("news").insertMany(newsData);

    // 5. VOLUNTEERS
    console.log("🌱 Seeding Volunteers...");
    await db.collection("volunteers").deleteMany({});
    await db.collection("volunteers").insertMany(volunteersData);
    
    // 6. PODCASTS
    console.log("🌱 Seeding Podcasts...");
    await db.collection("podcasts").deleteMany({});
    await db.collection("podcasts").insertMany(podcastsData);

    // 7. VIDEOS
    console.log("🌱 Seeding Videos...");
    await db.collection("videos").deleteMany({});
    await db.collection("videos").insertMany(videosData);

    console.log("🎉 Database seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();