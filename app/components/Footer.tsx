"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";
import React, { useState } from "react";

// --- Enhanced Bilingual Data Structure ---
const footerData = {
  mn: {
    slogan: "Сайн дурын үйлсээр нийгэмдээ гэрэл нэмье.",
    exploreTitle: "Нүүр",
    exploreLinks: [
      { text: "Бидний тухай", href: "/about" },
      { text: "Сайн дурын ажил", href: "/volunteers" },
      { text: "Арга хэмжээ", href: "/events" },
      { text: "Мэдээ", href: "/news" },
    ],
    supportTitle: "Дэмжлэг",
    supportLinks: [
      { text: "Холбоо барих", href: "/contact" },
      { text: "Тусламж", href: "/help" },
      { text: "Нууцлалын бодлого", href: "/privacy" },
    ],
    contactTitle: "Холбоо барих",
    address: "Time Center, 504 тоот, Улаанбаатар, Монгол",
    email: "volunteercenter22@gmail.com",
    phone: "+976 9599 7999",
    newsletterTitle: "Мэдээлэл авах",
    newsletterPlaceholder: "Таны имэйл хаяг",
    subscribeButton: "Бүртгүүлэх",
    copyright: `© ${new Date().getFullYear()} Volunteer Center Mongolia. Бүх эрх хуулиар хамгаалагдсан.`,
  },
  en: {
    slogan: "Lighting up our community through volunteerism.",
    exploreTitle: "Explore",
    exploreLinks: [
      { text: "About Us", href: "/about" },
      { text: "Volunteer Work", href: "/volunteers" },
      { text: "Events", href: "/events" },
      { text: "News", href: "/news" },
    ],
    supportTitle: "Support",
    supportLinks: [
      { text: "Contact Us", href: "/contact" },
      { text: "Help Center", href: "/help" },
      { text: "Privacy Policy", href: "/privacy" },
    ],
    contactTitle: "Get in Touch",
    address: "Time Center, Room 504, Ulaanbaatar, Mongolia",
    email: "volunteercenter22@gmail.com",
    phone: "+976 9599 7999",
    newsletterTitle: "Stay Connected",
    newsletterPlaceholder: "Your email address",
    subscribeButton: "Subscribe",
    copyright: `© ${new Date().getFullYear()} Volunteer Center Mongolia. All rights reserved.`,
  },
};

const Footer = () => {
  const { language } = useLanguage();
  const t = footerData[language];
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subscription logic here
    console.log("Subscribed with:", email);
    setEmail('');
  };

  return (
    <footer className="relative bg-[#0d1127] text-slate-300 pt-32 pb-8 overflow-hidden">
        {/* Decorative Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[150px] fill-[#f8fafc]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
        </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logos.png" alt="Volunteer Center Logo" width={120} height={120} />
            </Link>
            <p className="text-xl text-slate-200 italic max-w-xs mb-8">"{t.slogan}"</p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={FaFacebookF} brandColor="#1877F2" />
              <SocialLink href="#" icon={FaTwitter} brandColor="#1DA1F2" />
              <SocialLink href="#" icon={FaInstagram} brandColor="#E4405F" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <FooterLinkColumn title={t.exploreTitle} links={t.exploreLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterLinkColumn title={t.supportTitle} links={t.supportLinks} />
          </div>

          {/* Contact & Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">{t.contactTitle}</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-4"><FaMapMarkerAlt className="text-pink-500 mt-1 flex-shrink-0" size={18} /><span>{t.address}</span></li>
              <li className="flex items-start gap-4"><FaPhoneAlt className="text-pink-500 mt-1 flex-shrink-0" size={16} /><span>{t.phone}</span></li>
              <li className="flex items-start gap-4"><FaEnvelope className="text-pink-500 mt-1 flex-shrink-0" size={16} /><span>{t.email}</span></li>
            </ul>
            <div className="mt-10">
                <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">{t.newsletterTitle}</h3>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder={t.newsletterPlaceholder} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-white placeholder-slate-500" />
                    <motion.button 
                      type="submit" 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30 text-white font-bold py-3 px-6 rounded-lg transition-shadow">
                        {t.subscribeButton}
                    </motion.button>
                </form>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="text-center text-sm text-slate-500 mt-20 border-t border-slate-800 pt-8">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

// --- Sub-Components for cleaner code ---

const FooterLinkColumn: React.FC<{ title: string; links: { text: string; href: string }[] }> = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.text}>
          <Link href={link.href} className="relative text-slate-400 hover:text-white transition-colors group">
            {link.text}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLink: React.FC<{ href: string; icon: React.ElementType; brandColor: string }> = ({ href, icon: Icon, brandColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-12 h-12 flex items-center justify-center bg-slate-800 border-2 border-slate-700 rounded-full transition-colors duration-300"
    >
      <motion.div
        animate={{ color: isHovered ? brandColor : '#94a3b8' }} // slate-400
        transition={{ duration: 0.3 }}
      >
        <Icon size={20} />
      </motion.div>
    </motion.a>
  );
};

export default Footer;