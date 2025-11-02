"use client";

import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React from "react";
import Image from "next/image";

// --- Bilingual Data (structure remains the same) ---
const partnersData = {
  mn: {
    sectionTitle: "Бидний Түншүүд",
    subtitle: "Хамтдаа бид үйлсээ улам өргөжүүлдэг.",
    partners: [
      { name: "UNICEF", image: "/unicef.png", href: "https://www.unicef.org/" },
      { name: "Монголын Хүүхдийн Сан", image: "/mongolian-org.png", href: "#" },
      { name: "World Vision", image: "/world-vision.png", href: "#" },
      { name: "Монголын Улаан Загалмай", image: "/red-cross.png", href: "#" },
      { name: "Монголын Залуучуудын Холбоо", image: "/youth-federation.png", href: "#" },
    ],
  },
  en: {
    sectionTitle: "Our Valued Partners",
    subtitle: "Together, We Amplify Our Impact.",
    partners: [
      { name: "UNICEF", image: "/unicef.png", href: "https://www.unicef.org/" },
      { name: "Mongolian Children's Fund", image: "/mongolian-org.png", href: "#" },
      { name: "World Vision", image: "/world-vision.png", href: "#" },
      { name: "Mongolian Red Cross", image: "/red-cross.png", href: "#" },
      { name: "Mongolian Youth Federation", image: "/youth-federation.png", href: "#" },
    ],
  },
};

const PartnersSection = () => {
  const { language } = useLanguage();
  const t = partnersData[language];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto max-w-6xl">
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
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* --- Partners Grid --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {t.partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- Partner Card Sub-Component with Interactive "Aura" Effect ---

interface PartnerCardProps {
  partner: {
    name: string;
    image: string;
    href: string;
  };
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 400, damping: 40 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 400, damping: 40 });

  // Transform mouse position into a soft, colored aura gradient
  const auraGradient = useTransform(
    [smoothMouseX, smoothMouseY],
    ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(56, 189, 248, 0.25) 0%, transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div variants={cardVariants}>
      <motion.a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(10000); mouseY.set(10000); }} // Move aura far off-screen to hide it
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="group relative w-full aspect-square rounded-2xl bg-slate-50 p-6 flex items-center justify-center overflow-hidden transition-all duration-300 border border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300"
        style={{ backgroundImage: auraGradient }}
      >
        <Image
          src={partner.image}
          alt={partner.name}
          width={120}
          height={120}
          className="object-contain w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      </motion.a>
    </motion.div>
  );
};

export default PartnersSection;