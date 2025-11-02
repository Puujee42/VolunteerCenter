"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { FaHandsHelping, FaGlobe, FaUsers, FaHeart } from "react-icons/fa";
import React, { useRef } from "react";

// --- Enhanced Bilingual Data ---
// I've added a 'values' array with descriptions to make the icons more impactful.
const aboutData = {
  mn: {
    sectionTitle: "Бидний тухай",
    content: "Монголын сайн дурынхны төв нь бүтээлч оролцоо бүхий хүмүүнлэг, иргэний ардчилсан нийгмийг бүтээхэд хувь нэмрээ оруулах эрхэм зорилготойгоор 2007 оноос хойш 50 гаруй үндэсний төсөл, хөтөлбөрийг амжилттай хэрэгжүүлж байна. Бид боловсрол, хүүхэд хамгаалал, тогтвортой амьжиргааны чиглэлээр сайн дурынхны загвар хөтөлбөрүүдийг бий болгон, түгээн дэлгэрүүлсээр ирсэн.",
    valuesTitle: "Бидний Үнэт Зүйлс",
    values: [
      { icon: FaHandsHelping, title: "Сайн дурын сэтгэл", description: "Бидний үйл ажиллагааны цөм нь сайн дурынхны хүсэл тэмүүлэл юм." },
      { icon: FaGlobe, title: "Дэлхийн нөлөө", description: "Орон нутгийн үйлсээрээ дамжуулан дэлхийн өөрчлөлтийг бий болгохыг зорьдог." },
      { icon: FaUsers, title: "Олон нийтийн хөгжил", description: "Хамтдаа илүү хүчирхэг, ээлтэй нийгмийг цогцлоон бэхжүүлдэг." },
      { icon: FaHeart, title: "Дур хүсэл ба халамж", description: "Хийж буй бүх зүйлдээ чин сэтгэлийн хандлага, халамжийг шингээдэг." }
    ]
  },
  en: {
    sectionTitle: "About Our Mission",
    content: "Since 2007, the Mongolian Volunteer Center has pursued the noble goal of building a humane, democratic society through creative volunteerism. We have successfully implemented over 50 national projects focused on education, child protection, and sustainable livelihoods, creating and scaling model volunteer programs.",
    valuesTitle: "Our Core Values",
    values: [
      { icon: FaHandsHelping, title: "Volunteer Spirit", description: "Driven by the passion and dedication of volunteers at our core." },
      { icon: FaGlobe, title: "Global Impact", description: "Creating global change through impactful local action and partnership." },
      { icon: FaUsers, title: "Community Building", description: "Strengthening bonds to build more resilient and supportive communities." },
      { icon: FaHeart, title: "Passion & Care", description: "Infusing genuine passion and care into everything we undertake." }
    ]
  },
};

const AboutSection = () => {
  const { language } = useLanguage();
  const t = aboutData[language];

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // A subtle parallax effect for the image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-warm-sand-50 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 -left-20 w-80 h-80 bg-teal-100 rounded-full opacity-30 filter blur-3xl"
        animate={{ x: [-20, 20, -20], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 -right-20 w-80 h-80 bg-coral-100 rounded-full opacity-30 filter blur-3xl"
        animate={{ x: [20, -20, 20], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Image */}
          <motion.div variants={itemVariants} className="relative h-[400px] lg:h-[550px] rounded-3xl shadow-2xl overflow-hidden">
             {/* This is a placeholder for your image. Replace the src with your image path. */}
            <motion.img
              src="/tsev.png"
              alt="Volunteers in action"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ y: imageY }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-800/20 to-transparent"></div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div variants={containerVariants} className="space-y-8">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-800"
            >
              <span className="bg-gradient-to-r from-teal-600 to-coral-500 bg-clip-text text-transparent">
                {t.sectionTitle}
              </span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed">
              {t.content}
            </motion.p>
            
            <motion.div variants={containerVariants} className="space-y-4 pt-4 border-t border-teal-100">
              {t.values.map((value, index) => (
                 <ValueCard key={index} icon={value.icon} title={value.title} description={value.description} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Sub-component for displaying a core value item for cleaner code
interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}
const ValueCard: React.FC<ValueCardProps> = ({ icon: Icon, title, description }) => {
    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }
  return (
    <motion.div variants={cardVariants} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors duration-300">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-coral-100 flex items-center justify-center">
            <Icon className="text-3xl text-teal-600" />
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default AboutSection;