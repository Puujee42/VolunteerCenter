"use client";

import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaPaperPlane } from "react-icons/fa";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
const contactData = {
  mn: {
    heroTitle: "Холбоо барих",
    heroSubtitle: "Асуулт байна уу, эсвэл хамтран ажиллах хүсэлтэй байна уу? Бидэнтэй холбогдоорой.",
    contactInfoTitle: "Шууд холбоо барих",
    socialTitle: "Сошиал хуудсууд",
    formTitle: "Зурвас илгээх",
    formPlaceholders: {
      name: "Таны нэр",
      email: "Таны имэйл хаяг",
      subject: "Гарчиг",
      message: "Таны зурвас...",
    },
    sendButton: "Зурвас илгээх",
    mapTitle: "Манай оффис",
    address: "Time Center, 504 тоот, Улаанбаатар, Монгол",
    phone: "+976 9599 7999",
    email: "info@volunteers.com",
  },
  en: {
    heroTitle: "Get in Touch",
    heroSubtitle: "Have a question or want to collaborate? We'd love to hear from you.",
    contactInfoTitle: "Direct Contact",
    socialTitle: "Follow Us",
    formTitle: "Send Us a Message",
    formPlaceholders: {
      name: "Your Name",
      email: "Your Email Address",
      subject: "Subject",
      message: "Your message...",
    },
    sendButton: "Send Message",
    mapTitle: "Our Office",
    address: "Time Center, Room 504, Ulaanbaatar, Mongolia",
    phone: "+976 9599 7999",
    email: "info@volunteers.com",
  },
};

// --- Main Contact Page Component ---
const ContactPage = () => {
  const { language } = useLanguage();
  const t = contactData[language];
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here (e.g., API call)
    console.log("Form submitted:", formData);
    alert("Message sent! (Simulation)");
  };

  return (
    <>
      <ContactHero t={t} />
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* --- Left Column: Info --- */}
            <motion.div variants={itemVariants} className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">{t.contactInfoTitle}</h2>
                <div className="space-y-6">
                  <InfoItem icon={FaMapMarkerAlt} text={t.address} />
                  <InfoItem icon={FaPhoneAlt} text={t.phone} href={`tel:${t.phone}`} />
                  <InfoItem icon={FaEnvelope} text={t.email} href={`mailto:${t.email}`} />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">{t.socialTitle}</h2>
                <div className="flex gap-4">
                  <SocialLink href="#" icon={FaFacebookF} brandColor="#1877F2" />
                  <SocialLink href="#" icon={FaTwitter} brandColor="#1DA1F2" />
                  <SocialLink href="#" icon={FaInstagram} brandColor="#E4405F" />
                </div>
              </div>
            </motion.div>

            {/* --- Right Column: Form --- */}
            <motion.div variants={itemVariants}>
                <div className="p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">{t.formTitle}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField name="name" placeholder={t.formPlaceholders.name} value={formData.name} onChange={handleChange} />
                        <InputField name="email" type="email" placeholder={t.formPlaceholders.email} value={formData.email} onChange={handleChange} />
                        <InputField name="subject" placeholder={t.formPlaceholders.subject} value={formData.subject} onChange={handleChange} />
                        <TextAreaField name="message" placeholder={t.formPlaceholders.message} value={formData.message} onChange={handleChange} />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                           <FaPaperPlane /> {t.sendButton}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* --- Map Section --- */}
      <MapSection t={t} />
      <Footer />
    </>
  );
};


// --- Sub-Components ---

const ContactHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="py-24 bg-white text-center">
    <div className="container px-4 mx-auto max-w-4xl">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        {t.heroTitle}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-slate-600">
        {t.heroSubtitle}
      </motion.p>
    </div>
  </div>
);

const InfoItem: React.FC<{ icon: React.ElementType; text: string; href?: string }> = ({ icon: Icon, text, href }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full flex-shrink-0">
      <Icon className="text-xl text-blue-500" />
    </div>
    <div>
      {href ? (
        <a href={href} className="text-lg text-slate-700 hover:text-blue-600 transition-colors break-words">{text}</a>
      ) : (
        <p className="text-lg text-slate-700 break-words">{text}</p>
      )}
    </div>
  </div>
);

const InputField: React.FC<any> = (props) => (
    <input {...props} required className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
);

const TextAreaField: React.FC<any> = (props) => (
    <textarea {...props} rows={5} required className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
);

const SocialLink: React.FC<{ href: string; icon: React.ElementType; brandColor: string }> = ({ href, icon: Icon, brandColor }) => (
  <motion.a href={href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.1 }} className="text-slate-500 hover:text-blue-600 transition-colors">
    <Icon size={24} />
  </motion.a>
);

const MapSection: React.FC<{ t: any }> = ({ t }) => (
    <section className="py-24 bg-slate-100">
        <div className="container px-4 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">{t.mapTitle}</h2>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.398681283731!2d106.9113274156417!3d47.9202562792074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96924f0c5a2777%3A0x8355a29a022f4ea9!2sMNUE%20Library!5e0!3m2!1sen!2smn!4v1672582882155!5m2!1sen!2smn"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </motion.div>
        </div>
    </section>
);


const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default ContactPage;