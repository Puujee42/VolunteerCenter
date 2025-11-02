"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaBroadcastTower,
} from "react-icons/fa";
import Image from "next/image"; // Import Image from next/image

// --- Bilingual Data Structure (remains unchanged) ---
const coursesData = {
    mn: {
      sectionTitle: "Манай Цахим Сургалтууд",
      intro:
        "Ур чадвараа хөгжүүлж, мэдлэгээ тэлэхэд зориулсан интерактив хичээлүүдэд хамрагдаарай.",
      buttonText: "Сургалтад Хамрагдах",
      dateLabel: "Огноо",
      durationLabel: "Үргэлжлэх хугацаа",
      allCoursesLabel: "Бүх сургалтууд",
      courses: [
        {
          id: "skill-based",
          category: { mn: "Менежмент", en: "Management" },
          title: "Ур чадварт суурилсан сайн дурын ажилтан",
          description:
            "Сайн дурын ажлын менежмент, зохион байгуулалтын талаар гүнзгийрүүлсэн мэдлэг олгоно.",
          date: "2025-01-25",
          duration: "2 цаг",
          enrollLink: "/enroll/skill-based",
          thumbnail: "/data.jpg",
        },
        {
          id: "problems",
          category: { mn: "Асуудал шийдвэрлэлт", en: "Problem Solving" },
          title: "Сайн дурын ажилтанд тулгарах асуудлууд",
          description:
            "Бодит кэйс дээр ажиллаж, саад бэрхшээлийг хэрхэн даван туулах аргачлалд суралцана.",
          date: "2025-03-04",
          duration: "1 цаг",
          enrollLink: "/enroll/problems",
          thumbnail: "/data.jpg",
        },
        {
          id: "planning",
          category: { mn: "Төлөвлөлт", en: "Planning" },
          title: "Жилийн үйл ажиллагааны төлөвлөгөө",
          description:
            "Үр дүнтэй, хэмжигдэхүйц жилийн төлөвлөгөөг хэрхэн боловсруулах арга зүйд суралцана.",
          date: "2025-04-08",
          duration: "1.5 цаг",
          enrollLink: "/enroll/planning",
          thumbnail: "/data.jpg",
        },
        {
          id: "child-protection",
          category: { mn: "Хүүхэд хамгаалал", en: "Child Safety" },
          title: "Хүүхэд хамгаалал ба сайн дурын ажил",
          description:
            "Хүүхэдтэй ажиллах сайн дурын ажилтнуудад зориулсан ёс зүй, аюулгүй байдлын сургалт.",
          date: "2025-05-08",
          duration: "3 цаг",
          enrollLink: "/enroll/child-protection",
          thumbnail: "/data.jpg",
        },
      ],
    },
    en: {
      sectionTitle: "Our E-Learning Courses",
      intro:
        "Engage with our interactive lessons designed to build skills and expand your knowledge.",
      buttonText: "Enroll in Course",
      dateLabel: "Date",
      durationLabel: "Duration",
      allCoursesLabel: "All Courses",
      courses: [
        {
          id: "skill-based",
          category: { mn: "Менежмент", en: "Management" },
          title: "Skill-Based Volunteering",
          description:
            "Gain in-depth knowledge on the principles of volunteer management and effective organization.",
          date: "2025-01-25",
          duration: "2 hours",
          enrollLink: "/enroll/skill-based",
          thumbnail: "/data.jpg",
        },
        {
          id: "problems",
          category: { mn: "Асуудал шийдвэрлэлт", en: "Problem Solving" },
          title: "Challenges for Volunteers",
          description:
            "Learn to navigate and resolve common issues with real-world case studies and best practices.",
          date: "2025-03-04",
          duration: "1 hour",
          enrollLink: "/enroll/problems",
          thumbnail: "/data.jpg",
        },
        {
          id: "planning",
          category: { mn: "Төлөвлөлт", en: "Planning" },
          title: "Annual Activity Planning",
          description:
            "Master the methodology for developing effective and measurable annual plans for your team.",
          date: "2025-04-08",
          duration: "1.5 hours",
          enrollLink: "/enroll/planning",
          thumbnail: "/data.jpg",
        },
        {
          id: "child-protection",
          category: { mn: "Хүүхэд хамгаалал", en: "Child Safety" },
          title: "Child Protection & Volunteering",
          description:
            "Essential ethics and safety training for any volunteer working with children.",
          date: "2025-05-08",
          duration: "3 hours",
          enrollLink: "/enroll/child-protection",
          thumbnail: "/data.jpg",
        },
      ],
    },
  };

const CoursesSection = () => {
  const { language } = useLanguage();
  const t = coursesData[language] || coursesData.mn;
  const [featuredCourseId, setFeaturedCourseId] = useState(t.courses[0].id);

  const featuredCourse = useMemo(
    () => t.courses.find((c) => c.id === featuredCourseId),
    [featuredCourseId, t.courses]
  );

  return (
    <section className="relative py-24 bg-white text-slate-800 overflow-hidden">
      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:2rem_2rem]"></div>

      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
            {t.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t.intro}</p>
        </motion.div>

        {/* --- Main Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column: Featured Course */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {featuredCourse && (
                <FeaturedCourseCard
                  key={featuredCourse.id}
                  course={featuredCourse}
                  t={t}
                  language={language}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Course List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 flex flex-col border border-slate-200 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-3">
              <FaBroadcastTower className="text-blue-500" />
              {t.allCoursesLabel}
            </h3>
            <div className="space-y-2">
              {t.courses.map((course) => (
                <CourseListItem
                  key={course.id}
                  course={course}
                  language={language}
                  isActive={featuredCourseId === course.id}
                  onClick={() => setFeaturedCourseId(course.id)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Sub-Components ---

interface Course {
  id: string;
  category: { mn: string; en: string };
  title: string;
  description: string;
  date: string;
  duration: string;
  enrollLink: string;
  thumbnail: string;
}

const FeaturedCourseCard: React.FC<{
  course: Course;
  t: any;
  language: "mn" | "en";
}> = ({ course, t, language }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2"
  >
    <div className="relative h-64 md:h-full min-h-[300px]">
      <Image
        src={course.thumbnail}
        alt={course.title}
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
      />
    </div>
    <div className="p-8 flex flex-col">
      <span className="mb-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full self-start">
        {course.category[language]}
      </span>
      <h3 className="text-3xl font-bold mb-4 text-slate-800">{course.title}</h3>
      <p className="text-slate-600 mb-6 flex-grow">{course.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 mb-8 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-500 text-xl" />
          <div>
            <span className="text-sm text-slate-500">{t.dateLabel}</span>
            <p className="font-semibold">{course.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaClock className="text-blue-500 text-xl" />
          <div>
            <span className="text-sm text-slate-500">{t.durationLabel}</span>
            <p className="font-semibold">{course.duration}</p>
          </div>
        </div>
      </div>
      <motion.a
        href={course.enrollLink}
        whileHover={{ y: -2 }}
        className="group w-full block text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-500/40 hover:bg-blue-700 transition-all duration-300"
      >
        {t.buttonText} <FaArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" />
      </motion.a>
    </div>
  </motion.div>
);

const CourseListItem: React.FC<{
  course: Course;
  language: "mn" | "en";
  isActive: boolean;
  onClick: () => void;
}> = ({ course, language, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: isActive ? 0 : 5 }}
    className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4 border-l-4 ${
      isActive
        ? "bg-blue-50 border-blue-500"
        : "border-transparent hover:bg-slate-100"
    }`}
  >
    <div className="flex-shrink-0 mt-1">
      <FaBookOpen
        className={`transition-colors duration-300 text-lg ${
          isActive ? "text-blue-500" : "text-slate-400"
        }`}
      />
    </div>
    <div>
      <h4 className={`font-bold transition-colors ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>{course.title}</h4>
      <p className="text-sm text-slate-500">{course.category[language]}</p>
    </div>
  </motion.button>
);

export default CoursesSection;