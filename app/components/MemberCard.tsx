"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import React from "react";

// --- 1. DATA STRUCTURE (Interface) ---
// This defines the shape of the data each card will receive.
export interface TeamMember {
  name: string;
  title: string;
  image: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// --- 2. PROPS INTERFACE ---
// Defines the props that the MemberCard component accepts.
interface MemberCardProps {
  member: TeamMember;
}

// --- 3. THE MEMBER CARD COMPONENT ---
const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  // Animation variants for the "reveal" effect on hover.
  const overlayVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/50"
    >
      <Image
        src={member.image}
        alt={member.name}
        width={400}
        height={500}
        className="w-full h-[400px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      {/* --- Information Overlay --- */}
      <motion.div
        initial="initial"
        whileHover="hover"
        className="absolute inset-0 flex flex-col justify-end text-white p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      >
        <h3 className="text-2xl font-bold">{member.name}</h3>

        {/* Details revealed on hover */}
        <motion.div variants={overlayVariants} className="mt-1">
          <p className="text-cyan-300 font-semibold">{member.title}</p>
          <div className="flex items-center gap-4 mt-4">
            {member.socials.linkedin && <SocialLink href={member.socials.linkedin} icon={FaLinkedinIn} />}
            {member.socials.twitter && <SocialLink href={member.socials.twitter} icon={FaTwitter} />}
            {member.socials.facebook && <SocialLink href={member.socials.facebook} icon={FaFacebookF} />}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Helper Component for Social Links ---
const SocialLink: React.FC<{ href: string; icon: React.ElementType }> = ({ href, icon: Icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.1 }}
    className="text-white/80 hover:text-white transition-colors"
  >
    <Icon size={20} />
  </motion.a>
);

// --- 4. EXAMPLE USAGE ---
// This is how you would use the MemberCard in a parent component (e.g., your TeamSection).
export const MembersGrid = () => {
  // Mock data that follows the TeamMember interface.
  const mockMembersData: TeamMember[] = [
    { name: "B. Tsevelmaa", title: "Founder & Consultant", image: "/tsev.jpg", socials: { linkedin: "#", twitter: "#" } },
    { name: "Kh. Selenge", title: "Executive Director", image: "/data.jpg", socials: { linkedin: "#", facebook: "#" } },
    { name: "Cheris Thomason", title: "Program Developer", image: "/data.jpg", socials: { linkedin: "#" } },
    { name: "B. Inju", title: "Program Coordinator", image: "/data.jpg", socials: { twitter: "#", facebook: "#" } },
  ];

  return (
    <div className="bg-slate-900 p-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {mockMembersData.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </motion.div>
    </div>
  );
};

export default MemberCard;