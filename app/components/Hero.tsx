"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { TypeAnimation } from "react-type-animation";
import { FaHandsHelping, FaHeart, FaUsers, FaGlobe, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { language } = useLanguage();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = {
    mn: {
      badge: "Монголын Сайн Дурын Төв",
     
      subheadline: "Сайн дурын ажил — хайр, хариуцлага, өөрчлөлтийн эхлэл. Та бидэнтэй нэгдэж, Монголын ирээдүйг гэрэлтэй болгоорой.",
      ctaVolunteer: "Сайн дурын болох",
      ctaDonate: "Хандив өгөх",
      stats: [
        { icon: FaUsers, end: 2850, label: "Сайн дурын гишүүн" },
        { icon: FaHandsHelping, end: 142, label: "Төсөл хэрэгжүүлсэн" },
        { icon: FaGlobe, end: 21, label: "Аймаг, сумд" },
      ],
      vision: "Бид сайн дурын үйл ажиллагаагаар дамжуулан хүчирхэг иргэдтэй, хүнлэг, энэрэнгүй нийгмийг бүтээнэ гэдэгт итгэдэг.",
      mission: "Сайн дурын бүтээлч оролцоо бүхий хүмүүнлэг, иргэний ардчилсан нийгмийг бүтээх.",
      goal: "Нийгмийн асуудалд олон нийт, хүүхэд залуучуудын идэвх, оролцоог зохион байгуулах.",
      trust: [
        { img: "/un-logo.png", text: "НҮБ-ын дэмжлэгтэй" },
        { img: "/gov-mn.png", text: "Засгийн газрын түнш" },
        { img: "/save-the-children.png", text: "Олон улсын байгууллага" },
      ],
    },
    en: {
      badge: "Mongolian Volunteer Center",
      subheadline: "Volunteering is the beginning of love, responsibility, and transformation. Join us to brighten Mongolia’s future.",
      ctaVolunteer: "Become a Volunteer",
      ctaDonate: "Donate Now",
      stats: [
        { icon: FaUsers, end: 2850, label: "Active Volunteers" },
        { icon: FaHandsHelping, end: 142, label: "Projects Completed" },
        { icon: FaGlobe, end: 21, label: "Provinces & Soums" },
      ],
      vision: "We believe in building a compassionate, humane society with empowered citizens through volunteerism.",
      mission: "To foster a humane, democratic civil society through creative volunteer engagement.",
      goal: "To mobilize public and youth participation in addressing social issues.",
      trust: [
        { img: "/un-logo.png", text: "Supported by UN" },
        { img: "/gov-mn.png", text: "Government Partner" },
        { img: "/save-the-children.png", text: "International NGO" },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 pt-24 md:pt-0"> {/* Added responsive padding-top */}
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-indigo-400 to-purple-300 rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="container relative z-10 px-4 py-16 text-center">
        {/* Main Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="backdrop-blur-2xl bg-white/75 rounded-3xl shadow-2xl border border-white/60 p-6 md:p-16"> {/* Adjusted padding for mobile */}
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold mb-8 shadow-md"
            >
              <FaGlobe />
              {t.badge}
            </motion.div>

            {/* Headline with Typewriter Animation - Mobile Fix Applied Here */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-800 leading-tight mb-6 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem]">
              <TypeAnimation
                key={`headline-${language}`}
                sequence={[
                  3000,
                  language === "mn" ? "Хамтдаа Өөрчлөе" : "Change Together",
                  3000,
                  language === "mn" ? "Сайн Дурын Хөдөлгөөн" : "Volunteer Movement",
                  3000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block"
              />
            </h1>

            {/* Subheadline with Fade Animation */}
            <motion.p
              key={`subheadline-${language}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            >
              {t.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/volunteers"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <FaHandsHelping className="group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">{t.ctaVolunteer}</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/donation"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg shadow-md border-2 border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                >
                  <FaHeart className="text-red-500 animate-pulse" />
                  {t.ctaDonate}
                </Link>
              </motion.div>
            </div>

            {/* Vision, Mission, Goal */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              {[
                { title: language === "mn" ? "Алсын хараа" : "Vision", text: t.vision },
                { title: language === "mn" ? "Эрхэм зорилго" : "Mission", text: t.mission },
                { title: language === "mn" ? "Зорилго" : "Goal", text: t.goal },
              ].map((item, i) => (
                <motion.div
                  key={`${item.title}-${language}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className="backdrop-blur-md bg-gradient-to-br from-white/60 to-white/40 rounded-2xl p-6 border border-white/50 shadow-inner hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="font-bold text-blue-700 mb-2 text-sm uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.stats.map((stat, i) => (
                <motion.div
                  key={`${stat.label}-${language}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-white/70"
                >
                  <stat.icon className="text-4xl text-cyan-600 mx-auto mb-3 animate-pulse" />
                  <div className="text-4xl font-black text-gray-800">
                    <CountUp end={stat.end} duration={2.5} separator="," />
                    {stat.end === 21 ? "+" : ""}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm font-medium"
        >
          {t.trust.map((item, i) => (
            <motion.span
              key={`${item.text}-${language}`}
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="flex items-center gap-2 backdrop-blur-sm bg-white/50 px-4 py-2 rounded-full border border-white/30 hover:bg-white/70 transition-all duration-300"
            >
              <img src={item.img} alt="" className="h-7 opacity-80" />
              {item.text}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: hasScrolled ? -30 : [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400"
      >
        <FaChevronDown className="text-2xl animate-bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;