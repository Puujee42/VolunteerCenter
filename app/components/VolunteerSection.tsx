"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import { FaCalendarAlt, FaRegCalendarCheck, FaBuilding, FaMapMarkerAlt, FaUsers, FaMask, FaLeaf, FaFutbol, FaQuestionCircle, FaSearch } from "react-icons/fa";

// --- DATA (structure remains unchanged) ---
const volunteersData = {
    mn: {
      sectionTitle: "Сайн дурын ажлын боломжууд",
      intro: "Өөрийн ур чадвар, хүсэл сонирхолд тохирох үйл ажиллагааг олж, нийгэмдээ эерэг нөлөө үзүүлээрэй.",
      filterLabels: { search: "Түлхүүр үгээр хайх...", city: "Хот сонгох", allCities: "Бүх хот" },
      countLabel: "боломж байна",
      buttonText: "Дэлгэрэнгүй",
      labels: { registration: "Бүртгэл", added: "Нийтэлсэн", organization: "Байгууллага", city: "Байршил" },
      volunteers: [
        { id: 1, title: "Байгаль орчны цэвэрлэгээ", description: "Орон нутгийн цэцэрлэгт хүрээлэн, гол мөрнийг цэвэрлэх ажилд нэгдээрэй.", registrationStart: "2025-10-01", registrationEnd: "2025-11-01", addedDate: "2025-09-15", organization: "Байгаль орчны агентлаг", enrollLink: "#", icon: FaLeaf, isNew: true, city: "Улаанбаатар" },
        { id: 2, title: "Залуучуудын Инновацийн Хакатон", description: "Залуу оюун ухаанд зөвлөгөө өгч, шийдэл бүтээхэд нь туслаарай.", registrationStart: "2025-11-10", registrationEnd: "2025-11-20", addedDate: "2025-10-01", organization: "Монголын Тек", enrollLink: "#", icon: FaUsers, isNew: true, city: "Эрдэнэт" },
        { id: 3, title: "Олон нийтийн эрүүл мэндийн аян", description: "Орон нутгийн эрүүл мэндийн үзлэгт эмнэлгийн мэргэжилтнүүдэд туслаарай.", registrationStart: "2025-09-01", registrationEnd: "2025-09-30", addedDate: "2025-08-20", organization: "Эрүүл мэндийн газар", enrollLink: "#", icon: FaMask, isNew: false, city: "Дархан" },
        { id: 4, title: "Улсын наадмын туслах ажилтан", description: "Улсын хэмжээний томоохон спортын арга хэмжээг зохион байгуулахад туслаарай.", registrationStart: "2025-12-01", registrationEnd: "2025-12-15", addedDate: "2025-11-01", organization: "Спортын холбоо", enrollLink: "#", icon: FaFutbol, isNew: true, city: "Чойбалсан" },
        { id: 5, title: "Жилийн төлөвлөгөөний хороо", description: "Бидний ирэх жилийн төлөвлөгөөг боловсруулахад стратегийн ур чадвараа ашиглан туслаарай.", registrationStart: "2025-11-12", registrationEnd: "2025-12-08", addedDate: "2025-11-10", organization: "VCM-ийн төв оффис", enrollLink: "#", icon: FaQuestionCircle, isNew: false, city: "Улаанбаатар" },
        { id: 6, title: "Цахим боловсролын сургагч багш", description: "Ахмад настнуудад компьютерийн анхан шатны мэдлэг олгох.", registrationStart: "2025-10-05", registrationEnd: "2025-10-25", addedDate: "2025-09-20", organization: "Олон нийтийн холбоо", enrollLink: "#", icon: FaUsers, isNew: false, city: "Улаанбаатар" },
      ],
    },
    en: {
      sectionTitle: "Volunteer Opportunities",
      intro: "Find the perfect role to match your skills and passion, and make a real impact in the community.",
      filterLabels: { search: "Search by keyword...", city: "Select a city", allCities: "All Cities" },
      countLabel: "Opportunities",
      buttonText: "View Details",
      labels: { registration: "Registration", added: "Date Added", organization: "Organization", city: "Location" },
      volunteers: [
        { id: 1, title: "Environmental Cleanup", description: "Join us to clean up local parks and rivers.", registrationStart: "2025-10-01", registrationEnd: "2025-11-01", addedDate: "2025-09-15", organization: "Environmental Agency", enrollLink: "#", icon: FaLeaf, isNew: true, city: "Ulaanbaatar" },
        { id: 2, title: "Youth Innovation Hackathon", description: "Mentor young minds and help them build solutions.", registrationStart: "2025-11-10", registrationEnd: "2025-11-20", addedDate: "2025-10-01", organization: "Tech for Mongolia", enrollLink: "#", icon: FaUsers, isNew: true, city: "Erdenet" },
        { id: 3, title: "Community Health Drive", description: "Assist medical professionals in local health checks.", registrationStart: "2025-09-01", registrationEnd: "2025-09-30", addedDate: "2025-08-20", organization: "Health Department", enrollLink: "#", icon: FaMask, isNew: false, city: "Darkhan" },
        { id: 4, title: "National Games Support Staff", description: "Help coordinate a major national sports event.", registrationStart: "2025-12-01", registrationEnd: "2025-12-15", addedDate: "2025-11-01", organization: "Sports Federation", enrollLink: "#", icon: FaFutbol, isNew: true, city: "Choibalsan" },
        { id: 5, title: "Annual Planning Committee", description: "Lend your strategic skills to help plan our next year.", registrationStart: "2025-11-12", registrationEnd: "2025-12-08", addedDate: "2025-11-10", organization: "VCM Headquarters", enrollLink: "#", icon: FaQuestionCircle, isNew: false, city: "Ulaanbaatar" },
        { id: 6, title: "Digital Literacy Tutor", description: "Teach essential computer skills to elderly citizens.", registrationStart: "2025-10-05", registrationEnd: "2025-10-25", addedDate: "2025-09-20", organization: "Community Connect", enrollLink: "#", icon: FaUsers, isNew: false, city: "Ulaanbaatar" },
      ],
    },
};

const allCities = {
    mn: ['Улаанбаатар', 'Эрдэнэт', 'Дархан', 'Чойбалсан'],
    en: ['Ulaanbaatar', 'Erdenet', 'Darkhan', 'Choibalsan'],
};

// --- 2. THE MAIN PAGE COMPONENT ---

const VolunteersSection = () => {
    const { language } = useLanguage();
    const t = volunteersData[language];
    const cities = allCities[language];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const filteredVolunteers = t.volunteers.filter(v => 
        (v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedCity || v.city === selectedCity)
    );

    return (
        <section className="py-24 bg-white text-slate-800 relative overflow-hidden">
            {/* Subtle Dot Grid Background */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
            
            <div className="container px-4 mx-auto max-w-7xl relative z-10">
                <HeroHeader t={t} total={filteredVolunteers.length} cities={cities} setSearchTerm={setSearchTerm} setSelectedCity={setSelectedCity} />

                <motion.div
                    key={language + selectedCity + searchTerm}
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                    {filteredVolunteers.map((volunteer) => (
                        <VolunteerCard key={volunteer.id} volunteer={volunteer} t={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// --- 3. SUB-COMPONENTS ---

const HeroHeader: React.FC<any> = ({ t, total, cities, setSearchTerm, setSelectedCity }) => (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
    >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">{t.sectionTitle}</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">{t.intro}</p>
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder={t.filterLabels.search} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div className="relative w-full md:w-auto">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <select onChange={(e) => setSelectedCity(e.target.value)} className="appearance-none w-full md:w-52 bg-slate-100 border border-slate-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    <option value="">{t.filterLabels.allCities}</option>
                    {cities.map((city: string) => <option key={city} value={city}>{city}</option>)}
                </select>
            </div>
            <div className="px-4 py-3 bg-blue-600 text-white rounded-lg font-bold text-base whitespace-nowrap">
                {total} {t.countLabel}
            </div>
        </div>
    </motion.div>
);

const VolunteerCard: React.FC<{ volunteer: any, t: any }> = ({ volunteer, t }) => {
    const { icon: Icon } = volunteer;

    // --- 3D Tilt Effect Logic ---
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
            style={{ perspective: "1000px" }} // Parent needs perspective for 3D effect
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { mouseX.set(175); mouseY.set(225); }} // Reset to center
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
                className="group relative bg-white rounded-2xl p-8 flex flex-col h-[450px] border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
                {volunteer.isNew && <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-blue-500/50">NEW</div>}
                
                <div style={{ transform: "translateZ(20px)" }}> {/* Make content "pop out" */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg"><Icon className="text-2xl" /></div>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight flex-1">{volunteer.title}</h3>
                    </div>

                    <p className="text-slate-600 flex-grow mb-6">{volunteer.description}</p>
                </div>
                
                <div className="mt-auto border-t border-slate-200 pt-6 space-y-3 text-sm" style={{ transform: "translateZ(10px)" }}>
                    <InfoRow icon={FaRegCalendarCheck} label={t.labels.registration} value={`${volunteer.registrationStart} to ${volunteer.registrationEnd}`} />
                    <InfoRow icon={FaBuilding} label={t.labels.organization} value={volunteer.organization} />
                    <InfoRow icon={FaMapMarkerAlt} label={t.labels.city} value={volunteer.city} />
                </div>

                <a href={volunteer.enrollLink} className="mt-8 w-full block text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-500/40 hover:bg-blue-700 transition-all duration-300" style={{ transform: "translateZ(20px)" }}>
                    {t.buttonText}
                </a>
            </motion.div>
        </motion.div>
    );
};

const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="mr-3 text-blue-500 flex-shrink-0 text-lg mt-0.5" />
        <div>
            <strong className="text-slate-700">{label}:</strong>
            <span className="text-slate-600 ml-1">{value}</span>
        </div>
    </div>
);

export default VolunteersSection;