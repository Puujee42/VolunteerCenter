"use client";

import { motion, Variants } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import Image from "next/image";

// --- Bilingual Data Structure (remains unchanged) ---
const teamData = {
    mn: {
      sectionTitle: "Биднийг Удирдагчид",
      subtitle: "Эерэг өөрчлөлтийг бүтээх чин хүсэл эрмэлзэлтэй, туршлагатай баг.",
      ctaText: "Манай багт нэгдэх",
      ctaLink: "/careers",
      members: [
        {
          name: "Б. Цэвэлмаа",
          title: "Үүсгэн байгуулагч, Зөвлөх",
          image: "/tsev.png",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "Х. Сэлэнгэ",
          title: "Гүйцэтгэх захирал",
          image: "/data.jpg",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "Cheris Thomason",
          title: "Хөтөлбөр хөгжүүлэгч",
          image: "/tsev.png",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "Б. Инж",
          title: "Хөтөлбөр зохицуулагч",
          image: "/data.jpg",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
      ],
    },
    en: {
      sectionTitle: "Meet the Visionaries",
      subtitle: "A passionate and experienced team dedicated to driving positive change.",
      ctaText: "Join Our Team",
      ctaLink: "/careers",
      members: [
        {
          name: "B. Tsevelmaa",
          title: "Founder & Consultant",
          image: "/tsev.png",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "Kh. Selenge",
          title: "Executive Director",
          image: "/data.jpg",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "Cheris Thomason",
          title: "Program Developer",
          image: "/data.jpg",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
        {
          name: "B. Inju",
          title: "Program Coordinator",
          image: "/data.jpg",
          socials: { facebook: "#", linkedin: "#", twitter: "#" },
        },
      ],
    },
  };
const TeamSection = () => {
  const { language } = useLanguage();
  const t = teamData[language];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
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
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* --- Team Grid --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {t.members.map((member, i) => (
            <TeamMemberCard key={i} member={member} />
          ))}
        </motion.div>
        
        {/* --- Call to Action --- */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-center mt-20"
        >
            <Link href={t.ctaLink} className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
                {t.ctaText}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </motion.div>

      </div>
    </section>
  );
};

// --- Team Member Card Sub-Component ---

interface Member {
  name: string;
  title: string;
  image: string;
  socials: { facebook: string; twitter: string; linkedin: string; };
}

const TeamMemberCard: React.FC<{ member: Member }> = ({ member }) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="overflow-hidden">
        <Image 
            src={member.image} 
            alt={member.name} 
            width={400} 
            height={400} 
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      
      {/* Information Section */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
        <p className="text-blue-600 font-semibold mt-1">{member.title}</p>
        
        <div className="flex justify-center items-center gap-5 mt-4 pt-4 border-t border-slate-200">
            <SocialLink href={member.socials.facebook} icon={FaFacebookF} />
            <SocialLink href={member.socials.twitter} icon={FaTwitter} />
            <SocialLink href={member.socials.linkedin} icon={FaLinkedinIn} />
        </div>
      </div>
    </motion.div>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ElementType }> = ({ href, icon: Icon }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        whileHover={{ scale: 1.1 }}
        className="text-slate-400 hover:text-blue-600 transition-colors"
    >
        <Icon size={20} />
    </motion.a>
);

export default TeamSection;