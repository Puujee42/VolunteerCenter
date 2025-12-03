"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaBroadcastTower,
} from "react-icons/fa";
import Image from "next/image";

// --- Static UI Text ---
const uiText = {
    mn: {
      sectionTitle: "Манай Цахим Сургалтууд",
      intro: "Ур чадвараа хөгжүүлж, мэдлэгээ тэлэхэд зориулсан интерактив хичээлүүдэд хамрагдаарай.",
      buttonText: "Сургалтад Хамрагдах",
      dateLabel: "Огноо",
      durationLabel: "Үргэлжлэх хугацаа",
      allCoursesLabel: "Бүх сургалтууд",
    },
    en: {
      sectionTitle: "Our E-Learning Courses",
      intro: "Engage with our interactive lessons designed to build skills and expand your knowledge.",
      buttonText: "Enroll in Course",
      dateLabel: "Date",
      durationLabel: "Duration",
      allCoursesLabel: "All Courses",
    },
};

const CoursesSection = () => {
  const { language } = useLanguage();
  const t = uiText[language];
  
  // --- STATE ---
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredCourseId, setFeaturedCourseId] = useState<string | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
        try {
            const res = await fetch("/api/courses");
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                setCourses(json.data);
                setFeaturedCourseId(json.data[0].id); // Set the first course as featured
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);
  
  // Find featured course
  const featuredCourse = useMemo(
    () => courses.find((c) => c.id === featuredCourseId),
    [featuredCourseId, courses]
  );
  
  if (loading) return (
    <section className="py-24 text-center">Loading courses...</section>
  );

  if (courses.length === 0) return null; // Or show a "No courses available" message

  return (
    <section className="relative py-24 bg-white text-slate-800 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[2rem_2rem]"></div>

      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
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
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 flex flex-col border border-slate-200 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-3">
              <FaBroadcastTower className="text-blue-500" />
              {t.allCoursesLabel}
            </h3>
            <div className="space-y-2">
              {courses.map((course) => (
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

const FeaturedCourseCard: React.FC<{ course: any; t: any; language: 'mn' | 'en' }> = ({ course, t, language }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2"
  >
    <div className="relative h-64 md:h-full min-h-[300px]">
      <Image
        src={course.thumbnail}
        alt={course.title[language]}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="p-8 flex flex-col">
      <span className="mb-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full self-start">
        {course.category[language]}
      </span>
      <h3 className="text-3xl font-bold mb-4 text-slate-800">{course.title[language]}</h3>
      <p className="text-slate-600 mb-6 grow">{course.description[language]}</p>
      
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
            <p className="font-semibold">{course.duration[language]}</p>
          </div>
        </div>
      </div>
      
      <motion.a
        href={`/courses/${course.id}`} // Link to dynamic page
        whileHover={{ y: -2 }}
        className="group w-full block text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-500/40 hover:bg-blue-700 transition-all"
      >
        {t.buttonText} <FaArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" />
      </motion.a>
    </div>
  </motion.div>
);

const CourseListItem: React.FC<{ course: any; language: 'mn' | 'en'; isActive: boolean; onClick: () => void; }> = ({ course, language, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: isActive ? 0 : 5 }}
    className={`w-full text-left p-4 rounded-lg transition-all flex items-start gap-4 border-l-4 ${
      isActive
        ? "bg-blue-50 border-blue-500"
        : "border-transparent hover:bg-slate-100"
    }`}
  >
    <div className="shrink-0 mt-1">
      <FaBookOpen
        className={`transition-colors text-lg ${
          isActive ? "text-blue-500" : "text-slate-400"
        }`}
      />
    </div>
    <div>
      <h4 className={`font-bold transition-colors ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>
        {course.title[language]}
      </h4>
      <p className="text-sm text-slate-500">{course.category[language]}</p>
    </div>
  </motion.button>
);

export default CoursesSection;