"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaArrowRight, FaRegCalendarCheck, FaBuilding, FaMapMarkerAlt, FaUsers, FaLeaf, FaFutbol } from "react-icons/fa";
import React from "react";

// --- 1. INTERFACES (Unchanged) ---
export interface TeamMember {
  name: string;
  title: string;
  image: string;
  socials: { facebook?: string; twitter?: string; linkedin?: string; };
}

export interface VolunteerOpportunity {
  id: number | string;
  title: string;
  description: string;
  organization: string;
  city: string;
  registrationStart: string;
  registrationEnd: string;
  isNew: boolean;
  icon: React.ElementType;
  enrollLink: string;
}

// --- 2. BILINGUAL MOCK DATA (Unchanged) ---
const teamData = {
  mn: {
    sectionTitle: "Биднийг Удирдагчид",
    subtitle: "Эерэг өөрчлөлтийг бүтээх чин хүсэл эрмэлзэлтэй, туршлагатай баг.",
    ctaText: "Манай багт нэгдэх",
    ctaLink: "/careers",
    members: [
      { name: "Б. Цэвэлмаа", title: "Үүсгэн байгуулагч, Зөвлөх", image: "/tsev.png", socials: { linkedin: "#", twitter: "#" } },
      { name: "Х. Сэлэнгэ", title: "Гүйцэтгэх захирал", image: "/selenge.jpg", socials: { linkedin: "#", facebook: "#" } },
      { name: "Cheris Thomason", title: "Хөтөлбөр хөгжүүлэгч", image: "/thompson.jpg", socials: { linkedin: "#" } },
      { name: "Б. Инж", title: "Хөтөлбөр зохицуулагч", image: "/data.jpg", socials: { twitter: "#", facebook: "#" } },
    ] as TeamMember[],
  },
  en: {
    sectionTitle: "Meet the Visionaries",
    subtitle: "A passionate and experienced team dedicated to driving positive change.",
    ctaText: "Join Our Team",
    ctaLink: "/careers",
    members: [
      { name: "B. Tsevelmaa", title: "Founder & Consultant", image: "/tsev.png", socials: { linkedin: "#", twitter: "#" } },
      { name: "Kh. Selenge", title: "Executive Director", image: "/selenge.jpg", socials: { linkedin: "#", facebook: "#" } },
      { name: "Cheris Thomason", title: "Program Developer", image: "/thompson.jpg", socials: { linkedin: "#" } },
      { name: "B. Inju", title: "Program Coordinator", image: "/data.jpg", socials: { twitter: "#", facebook: "#" } },
    ] as TeamMember[],
  },
};


// --- 3. THE MAIN PAGE COMPONENT ---
const Members = () => {
  const { language } = useLanguage();
  const t_members = teamData[language];

  return (
    <>
      {/* --- Section 1: Team Members --- */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">{t_members.sectionTitle}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t_members.subtitle}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t_members.members.map((member) => <MemberCard key={member.name} member={member} />)}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} className="text-center mt-20">
            <Link href={t_members.ctaLink} className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1">
              {t_members.ctaText} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Volunteer Opportunities --- */}
     
    </>
  );
};


// --- 4. SUB-COMPONENTS ---

const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="overflow-hidden">
        <Image src={member.image} alt={member.name} width={400} height={400} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
        <p className="text-blue-600 font-semibold mt-1">{member.title}</p>
        <div className="flex justify-center items-center gap-5 mt-4 pt-4 border-t border-slate-200">
          {member.socials.linkedin && <SocialLink href={member.socials.linkedin} icon={FaLinkedinIn} />}
          {member.socials.twitter && <SocialLink href={member.socials.twitter} icon={FaTwitter} />}
          {member.socials.facebook && <SocialLink href={member.socials.facebook} icon={FaFacebookF} />}
        </div>
      </div>
    </motion.div>
);

const SocialLink: React.FC<{ href: string; icon: React.ElementType }> = ({ href, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
    <Icon size={20} />
  </a>
);

const VolunteerCard: React.FC<{ volunteer: VolunteerOpportunity; t: any }> = ({ volunteer, t }) => {
    const { icon: Icon } = volunteer;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const rotateX = useTransform(mouseY, [0, 450], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 350], [-10, 10]);
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { mouseX.set(175); mouseY.set(225); }}
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
                className="group relative bg-white rounded-2xl p-8 flex flex-col h-[450px] border border-slate-200 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
                {volunteer.isNew && <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-blue-500/50">NEW</div>}
                
                <div style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg"><Icon className="text-2xl" /></div>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight flex-1">{volunteer.title}</h3>
                    </div>
                    <p className="text-slate-600 flex-grow mb-6">{volunteer.description}</p>
                </div>
                
                <div className="mt-auto border-t border-slate-200 pt-6 space-y-3 text-sm" style={{ transform: "translateZ(20px)" }}>
                    <InfoRow icon={FaRegCalendarCheck} label={t.labels.registration} value={`${volunteer.registrationStart} - ${volunteer.registrationEnd}`} />
                    <InfoRow icon={FaBuilding} label={t.labels.organization} value={volunteer.organization} />
                    <InfoRow icon={FaMapMarkerAlt} label={t.labels.city} value={volunteer.city} />
                </div>
                <div className="mt-8" style={{ transform: "translateZ(40px)" }}>
                    <Link href={volunteer.enrollLink} className="w-full block text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-500/40 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">{t.buttonText}</Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="mr-3 text-blue-500 flex-shrink-0 text-lg mt-0.5" />
        <div>
            <strong className="text-slate-700">{label}:</strong>
            <span className="text-slate-600 ml-1">{value}</span>
        </div>
    </div>
);

export default Members;