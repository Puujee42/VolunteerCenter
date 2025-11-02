"use client";
import { motion, useScroll, useTransform, easeInOut } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useRef } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

// --- Enhanced Bilingual Data Structure ---
const greetingsData = {
  mn: {
    sectionTitle: "Захирлын мэндчилгээ",
    directorName: "Д. Ганзориг",
    directorTitle: "Гүйцэтгэх захирал, VCM",
    content: [
      "Монголын сайн дурынхны төвийн нэрийн өмнөөс та бүхэнд энэ өдрийн мэндийг хүргэе. 2007 оноос хойш бид хүмүүнлэг, иргэний ардчилсан нийгмийг бүтээхэд хувь нэмрээ оруулах эрхэм зорилгын дор нэгдэн, 50 гаруй үндэсний хэмжээний төсөл хөтөлбөрийг амжилттай хэрэгжүүлээд байна.",
      "Бидний энэхүү амжилт нь Дэлхийн Зөн, Улаан Загалмайн Нийгэмлэг зэрэг олон улсын болон дотоодын байгууллагуудтай тогтоосон бат бэх түншлэлийн үр дүн юм. Бид хамтдаа сайн дурын үйл ажиллагааны менежментийг боловсронгуй болгож, нийгэмд эерэг өөрчлөлтийг авчирсаар байна.",
    ],
    partnersTitle: "Бидний итгэлт түншүүд",
    buttonText: "Бидэнтэй нэгдэх",
    buttonLink: "/join",
    directorImage: "/tsev.png", // Director's portrait
    signatureImage: "/tsev.png", // Director's signature
    partners: [
        { name: "MLSP", logo: "/logos/mlsp.png" },
        { name: "World Vision", logo: "/logos/world-vision.png" },
        { name: "Good Neighbors", logo: "/logos/good-neighbors.png" },
        { name: "Peace Corps", logo: "/logos/peace-corps.png" },
        { name: "Caritas Czech", logo: "/logos/caritas-czech.png" },
        { name: "Caritas Mongolia", logo: "/logos/caritas-mongolia.png" },
        { name: "Red Cross", logo: "/logos/red-cross.png" },
    ],
  },
  en: {
    sectionTitle: "A Message From Our Director",
    directorName: "Ganzorig D.",
    directorTitle: "Executive Director, VCM",
    content: [
      "On behalf of the Mongolian Volunteer Center, I extend my warmest greetings. Since 2007, we have been united under the noble goal of contributing to a humane and democratic society, successfully implementing over 50 national-level projects.",
      "This journey has been made possible through strong partnerships with esteemed international and national organizations, from World Vision to the Red Cross Society. Together, we continue to refine volunteer management and drive positive change throughout our communities.",
    ],
    partnersTitle: "Our Trusted Partners",
    buttonText: "Join Our Mission",
    buttonLink: "/join",
    directorImage: "/tsev.png",
    signatureImage: "/tsev.png",
    partners: [
        { name: "MLSP", logo: "/logos/mlsp.png" },
        { name: "World Vision", logo: "/logos/world-vision.png" },
        { name: "Good Neighbors", logo: "/logos/good-neighbors.png" },
        { name: "Peace Corps", logo: "/logos/peace-corps.png" },
        { name: "Caritas Czech", logo: "/logos/caritas-czech.png" },
        { name: "Caritas Mongolia", logo: "/logos/caritas-mongolia.png" },
        { name: "Red Cross", logo: "/logos/red-cross.png" },
    ],
  },
};

const GreetingsSection = () => {
  const { language } = useLanguage();
  const t = greetingsData[language];

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeInOut } },
  };

  return (
    <>
      <section ref={sectionRef} className="py-24 md:py-32 bg-slate-100 relative overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="relative flex flex-col lg:flex-row items-center justify-center gap-12"
          >
              {/* Image Column */}
              <motion.div 
                className="w-full lg:w-2/5 xl:w-1/3 h-[400px] lg:h-[500px] flex-shrink-0 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeInOut, delay: 0.2 } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                  <motion.div
                      className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden"
                      style={{ y: imageY }}
                  >
                      <Image
                          src={t.directorImage}
                          alt={`Portrait of ${t.directorName}`}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                  </motion.div>
              </motion.div>

              {/* Content Column */}
              <motion.div 
                className="w-full lg:w-3/5 xl:w-2/3 lg:-ml-16 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 md:p-12 z-10"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: easeInOut } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                  <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-serif text-teal-700 mb-6">
                      {t.sectionTitle}
                  </motion.h2>

                  <motion.div variants={itemVariants} className="prose prose-lg text-slate-700 max-w-none space-y-5">
                      {t.content.map((p, i) => <p key={i}>{p}</p>)}
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-10 flex items-center gap-6">
                      <Image src={t.signatureImage} alt={`${t.directorName}'s signature`} width={160} height={55} className="flex-shrink-0" />
                      <div className="border-l-2 border-teal-200 pl-6">
                          <p className="text-xl font-bold text-slate-800">{t.directorName}</p>
                          <p className="text-md text-teal-600 font-semibold">{t.directorTitle}</p>
                      </div>
                  </motion.div>
              </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Partners Marquee Section */}
      <PartnersMarquee t={t} />
    </>
  );
};


type Partner = { name: string; logo: string };
type GreetingsData = typeof greetingsData.en;

const PartnersMarquee = ({ t }: { t: GreetingsData }) => {
    const duplicatedPartners = [...t.partners, ...t.partners, ...t.partners];

    const marqueeVariants = {
        animate: {
            x: [0, -1 * (t.partners.length * 224)], // 224px = 14rem width per item
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    duration: t.partners.length * 6, // Slower for a more premium feel
                    ease: "linear" as const,
                },
            },
        },
    };

    return (
        <div className="bg-white py-20 md:py-24 text-center">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-serif text-slate-800 mb-4">{t.partnersTitle}</h3>
              <p className="text-slate-500 mb-12 max-w-2xl mx-auto">We are proud to collaborate with leading organizations to maximize our impact.</p>
              <div className="relative w-full overflow-hidden 
                          before:absolute before:left-0 before:top-0 before:h-full before:w-16 md:before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent before:z-10
                          after:absolute after:right-0 after:top-0 after:h-full after:w-16 md:after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent after:z-10">
                  <motion.div
                      className="flex"
                      variants={marqueeVariants}
                      animate="animate"
                  >
                      {duplicatedPartners.map((partner, index) => (
                          <motion.div 
                            key={index} 
                            className="flex-shrink-0 w-56 h-24 flex items-center justify-center p-4"
                            whileHover={{ scale: 1.1 }}
                          >
                              <Image 
                                  src={partner.logo} 
                                  alt={partner.name}
                                  height={80}
                                  width={160}
                                  className="object-contain max-h-[80px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                              />
                          </motion.div>
                      ))}
                  </motion.div>
              </div>
              <motion.a 
                  href={t.buttonLink}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-16 inline-flex items-center gap-3 bg-teal-600 text-white font-bold py-3.5 px-10 rounded-full shadow-lg shadow-teal-900/20 hover:shadow-xl hover:shadow-teal-900/30 transition-all duration-300"
              >
                  {t.buttonText} <FaArrowRight />
              </motion.a>
            </div>
        </div>
    );
}

export default GreetingsSection;