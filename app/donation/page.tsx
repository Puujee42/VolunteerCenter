"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import Link from "next/link";
import { FaHeart, FaCalendar, FaArrowRight, FaChevronDown, FaHandsHelping, FaUserFriends, FaRegCreditCard } from "react-icons/fa";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
const donationData = {
  mn: {
    heroTitle: "Таны хандив өөрчлөлтийг бүтээдэг",
    heroSubtitle: "Таны дэмжлэг бүр бидэнд боловсрол, хүүхэд хамгаалал, олон нийтийн хөгжлийн хөтөлбөрүүдийг үргэлжлүүлэх боломжийг олгодог.",
    formTitle: "Хандив өгөх",
    frequency: { oneTime: "Нэг удаа", monthly: "Сар бүр" },
    amountPlaceholder: "Дүн оруулах",
    impactTitle: "Таны хандивын үр дүн",
    impacts: {
      10: "нэг хүүхдэд хичээлийн хэрэгсэл авч өгнө.",
      25: "нэг сайн дурын ажилтанд анхан шатны сургалт явуулна.",
      50: "нэг гэр бүлд нэг сарын хүнсний тусламж үзүүлнэ.",
      100: "олон нийтийн төслийг дэмжинэ.",
      custom: "сонгосон хөтөлбөрийг дэмжихэд тусална.",
    },
    personalInfo: "Хувийн мэдээлэл",
    namePlaceholder: "Нэр",
    emailPlaceholder: "Имэйл",
    paymentInfo: "Төлбөрийн мэдээлэл",
    donateButton: (amount:number) => `${amount}₮ Хандивлах`,
    secureDonation: "Аюулгүй хандив",
    faqTitle: "Итгэл ба Ил тод байдал",
    faqs: [
      { q: "Миний хандив хаана зарцуулагдах вэ?", a: "Таны хандив манай боловсрол, хүүхэд хамгаалал, олон нийтийн хөгжлийн хөтөлбөрүүдэд шууд зарцуулагдана." },
      { q: "Хандив татвараас чөлөөлөгдөх үү?", a: "Тийм, манай байгууллагад өгсөн бүх хандив татвараас бүрэн чөлөөлөгдөнө." },
    ],
    otherWaysTitle: "Бусад туслах арга замууд",
    otherWays: [
      { title: "Сайн дурын ажилтан болох", desc: "Цаг хугацаа, ур чадвараа зориул.", href: "/volunteers", icon: FaHandsHelping },
      { title: "Түнш болох", desc: "Манай эрхэм зорилгод нэгдээрэй.", href: "/partners", icon: FaUserFriends },
    ],
  },
  en: {
    heroTitle: "Your Gift Creates Impact",
    heroSubtitle: "Every contribution enables us to continue our vital programs in education, child protection, and community development across Mongolia.",
    formTitle: "Make a Donation",
    frequency: { oneTime: "One-Time", monthly: "Monthly" },
    amountPlaceholder: "Custom Amount",
    impactTitle: "Your Donation's Impact",
    impacts: {
      10: "provides school supplies for one child.",
      25: "provides essential training for one new volunteer.",
      50: "provides a month of food supplies for a family in need.",
      100: "helps fund a community-led development project.",
      custom: "will help support our programs where it's needed most.",
    },
    personalInfo: "Personal Information",
    namePlaceholder: "Full Name",
    emailPlaceholder: "Email Address",
    paymentInfo: "Payment Information",
    donateButton: (amount:number) => `Donate $${amount}`,
    secureDonation: "Secure Donation",
    faqTitle: "Transparency & Trust",
    faqs: [
      { q: "Where does my donation go?", a: "Your donation goes directly to our core programs in education, child protection, and sustainable community development." },
      { q: "Is my donation tax-deductible?", a: "Yes, as a registered non-profit organization, all donations are fully tax-deductible." },
    ],
    otherWaysTitle: "Other Ways to Give",
    otherWays: [
      { title: "Become a Volunteer", desc: "Give your time and skills.", href: "/volunteers", icon: FaHandsHelping },
      { title: "Become a Partner", desc: "Align your brand with our mission.", href: "/partners", icon: FaUserFriends },
    ],
  },
};

// --- Main Donation Page Component ---
const DonationPage = () => {
  const { language } = useLanguage();
  const t = donationData[language];
  const [frequency, setFrequency] = useState("oneTime");
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  
  const handleAmountSelect = (val: number | 'custom') => {
    if (val === 'custom') {
        setAmount(0);
    } else {
        setAmount(val);
        setCustomAmount("");
    }
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  return (
    <>
      <DonationHero t={t} />
      <section id="donation-form" className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* --- Donation Form --- */}
            <DonationForm t={t} frequency={frequency} setFrequency={setFrequency} amount={amount} customAmount={customAmount} setCustomAmount={setCustomAmount} handleAmountSelect={handleAmountSelect} finalAmount={finalAmount}/>

            {/* --- Impact Display --- */}
            <ImpactDisplay t={t} finalAmount={finalAmount} frequency={frequency} />
          </div>
        </div>
      </section>
      
      {/* --- FAQ & Other Ways to Give --- */}
      <FaqSection t={t} />
      <OtherWaysToGive t={t} />
      <Footer />
    </>
  );
};


// --- Sub-Components ---

const DonationHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white text-center">
    <div className="absolute inset-0 bg-black/50 z-10" />
    <img src="/hero-donation.jpg" alt="A volunteer helping a child" className="absolute inset-0 w-full h-full object-cover"/>
    <div className="relative z-20 max-w-4xl px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-4xl md:text-6xl font-bold mb-4">{t.heroTitle}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="text-lg md:text-xl text-slate-200">{t.heroSubtitle}</motion.p>
        <motion.a href="#donation-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className="mt-8 inline-block px-8 py-3 bg-cyan-500 rounded-lg font-bold shadow-lg hover:bg-cyan-600 transition-colors">
            Donate Now
        </motion.a>
    </div>
  </div>
);

const DonationForm: React.FC<any> = ({t, frequency, setFrequency, amount, customAmount, setCustomAmount, handleAmountSelect, finalAmount}) => {
    const amounts = [10, 25, 50, 100];
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.formTitle}</h2>
            {/* Frequency Toggle */}
            <div className="bg-slate-100 p-1 rounded-full grid grid-cols-2 gap-1 mb-6">
                <button onClick={() => setFrequency("oneTime")} className={`py-2 rounded-full font-semibold transition-colors ${frequency === "oneTime" ? 'bg-white shadow' : 'hover:bg-slate-200'}`}>{t.frequency.oneTime}</button>
                <button onClick={() => setFrequency("monthly")} className={`py-2 rounded-full font-semibold transition-colors ${frequency === "monthly" ? 'bg-white shadow' : 'hover:bg-slate-200'}`}>{t.frequency.monthly}</button>
            </div>
            {/* Amount Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {amounts.map(val => <button key={val} onClick={() => handleAmountSelect(val)} className={`py-3 rounded-lg font-bold border-2 transition-colors ${amount === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400 border-slate-300'}`}>${val}</button>)}
            </div>
             <input type="number" placeholder={t.amountPlaceholder} value={customAmount} onChange={(e) => { handleAmountSelect('custom'); setCustomAmount(e.target.value); }} className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 px-4 mb-6 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"/>
            
            {/* Form Fields */}
             <div className="space-y-4">
                 <input type="text" placeholder={t.namePlaceholder} className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500"/>
                 <input type="email" placeholder={t.emailPlaceholder} className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500"/>
             </div>
            
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                {t.donateButton(finalAmount)}
            </motion.button>
             <p className="text-center text-xs text-slate-500 mt-2">{t.secureDonation}</p>
        </div>
    );
}

const ImpactDisplay: React.FC<any> = ({t, finalAmount, frequency}) => {
    let impactKey = [10, 25, 50, 100].includes(finalAmount) ? finalAmount : 'custom';
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="sticky top-24">
             <h3 className="text-xl font-bold text-slate-800 mb-4">{t.impactTitle}</h3>
             <AnimatePresence mode="wait">
                <motion.div key={finalAmount + frequency} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-lg text-slate-700">
                        Your <strong className="text-blue-600">{frequency === 'monthly' ? 'monthly' : 'one-time'}</strong> donation of <strong className="text-blue-600">${finalAmount}</strong> {t.impacts[impactKey]}
                    </p>
                </motion.div>
             </AnimatePresence>
        </motion.div>
    );
}

const FaqSection: React.FC<{ t: any }> = ({ t }) => (
  <section className="py-20 bg-white">
    <div className="container px-4 mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">{t.faqTitle}</h2>
      <div className="space-y-4">
        {t.faqs.map((faq: any, i: number) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
      </div>
    </div>
  </section>
);

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 font-semibold text-slate-800">
        <span>{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><FaChevronDown /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="p-5 pt-0 text-slate-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OtherWaysToGive: React.FC<{ t: any }> = ({ t }) => (
    <section className="py-20 bg-slate-50">
        <div className="container px-4 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">{t.otherWaysTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {t.otherWays.map((way: any) => {
                    const Icon = way.icon;
                    return (
                        <Link href={way.href} key={way.title}>
                            <motion.div whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} className="p-8 bg-white rounded-xl shadow-lg border border-slate-100 h-full">
                                <Icon className="text-4xl text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{way.title}</h3>
                                <p className="text-slate-600">{way.desc}</p>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    </section>
);

export default DonationPage;