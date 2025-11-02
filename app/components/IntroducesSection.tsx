"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useRef } from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

// --- Enhanced Bilingual Data Structure ---
const introductionData = {
  mn: {
    title: "Үүсгэн байгуулагчийн танилцуулга",
    founderName: "Б. Цэвэлмаа",
    founderTitle: "Үүсгэн байгуулагч, Нийгмийн зөвлөх",
    image: "/tsev.png", // A real or placeholder photo of the founder
    signatureImage: "/tsev.png", // A transparent PNG of the signature
    text: [
      "Сайн дурын үйлсээр дамжуулан эерэг өөрчлөлтийг бүтээх хүсэл тэмүүлэл минь Монголын сайн дурынхны төвийг үүсгэн байгуулахад хүргэсэн юм. Бид хамтдаа, эх орныхоо өнцөг булан бүрт хүрч, хүмүүнлэг, иргэний нийгмийг цогцлоохын төлөө тууштай ажиллаж байна.",
      "Бидний үйл ажиллагааны гол цөм нь хүн бүрийн дотор орших тусч сэтгэл бөгөөд тэрхүү сэтгэлийг зөв гольдролд нь оруулж, бодит үйлдэл болгох нь бидний эрхэм зорилго юм. Таныг энэхүү үнэ цэнтэй аялалд нэгдэхийг урьж байна.",
    ],
    highlightsTitle: "Онцлох амжилтууд",
    highlights: [
      "Нийгмийн ажлын багш, зөвлөх мэргэжилтэн",
      "50 гаруй үндэсний хэмжээний төсөл, хөтөлбөр удирдсан",
      "Олон нийтийн оролцоо ба залуучуудын хөгжлийн чиглэлээр мэргэшсэн",
    ],
  },
  en: {
    title: "Meet Our Founder",
    founderName: "B. Tsevelmaa",
    founderTitle: "Founder & Community Engagement Consultant",
    image: "/tsev.png",
    signatureImage: "/tsev.png",
    text: [
      "My passion for creating positive change through volunteerism led me to establish the Mongolian Volunteer Center. Together, we have reached every corner of our nation, working tirelessly to build a more humane and civil society.",
      "At the core of our work is the belief in the helping spirit that resides in everyone. Our mission is to channel that spirit into meaningful, tangible action. I invite you to join us on this invaluable journey of contribution and growth.",
    ],
    highlightsTitle: "Key Highlights",
    highlights: [
      "Certified Social Work Teacher and Consultant",
      "Led over 50 national-level projects and programs",
      "Specialist in community engagement and youth development",
    ],
  },
};

const IntroductionSection = () => {
  const { language } = useLanguage();
  const t = introductionData[language];

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="a" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(2) rotate(0)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M-10 40a50 50 0 0 1 100 0Z" strokeWidth="1" stroke="hsla(215, 28%, 90%, 1)" fill="none"/></pattern></defs><rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)"/></svg>
      </div>

      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Founder's Profile */}
          <motion.div variants={itemVariants} className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative w-72 h-72 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100"
              />
              <div className="absolute inset-3 rounded-full overflow-hidden shadow-xl">
                <motion.div style={{ y: imageY }} className="h-full">
                  <Image
                    src={t.image}
                    alt={t.founderName}
                    width={276}
                    height={276}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{t.founderName}</h3>
            <p className="text-lg text-blue-600 font-semibold mb-4">{t.founderTitle}</p>
            <Image src={t.signatureImage} alt={`${t.founderName}'s signature`} width={150} height={50} />
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
            }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                {t.title}
              </span>
            </motion.h2>

            <div className="prose prose-lg text-slate-600 max-w-none space-y-4">
              {t.text.map((p, i) => <motion.p variants={itemVariants} key={i}>{p}</motion.p>)}
            </div>
            
            <div className="mt-8 pt-6 border-t border-blue-200/60">
                <motion.h4 variants={itemVariants} className="text-xl font-bold text-slate-700 mb-4">{t.highlightsTitle}</motion.h4>
                <ul className="space-y-3">
                    {t.highlights.map((item, i) => (
                        <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                            <FaCheckCircle className="text-cyan-500 text-xl mt-1 flex-shrink-0" />
                            <span className="text-slate-600">{item}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default IntroductionSection;