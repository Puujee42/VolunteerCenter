"use client";

import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  FaUser, FaLock, FaMapMarkerAlt, FaBirthdayCake, 
  FaEnvelope, FaIdCard, FaAddressCard, FaEye, FaEyeSlash, FaBuilding, FaHandshake
} from "react-icons/fa";
import { SignedOut, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// --- 1. IMPORT YOUR STATIC LOCATIONS FILE ---
import { mongolianLocations } from "./location"; // Adjust path if file name is different (e.g. ./data)

// --- Bilingual Data Store ---
const registerData = {
    mn: {
        heroQuote: "Өөрчлөлтийн нэг хэсэг болж, нийгэмдээ гэрэл нэмээрэй.",
        title: "Шинэ бүртгэл үүсгэх",
        fullNamePlaceholder: "Бүтэн нэр", 
        registryPlaceholder: "Регистрийн дугаар",
        idPlaceholder: "Хэрэглэгчийн нэр", 
        emailPlaceholder: "Имэйл хаяг",
        passwordPlaceholder: "Нууц үг",
        confirmPasswordPlaceholder: "Нууц үг давтах",
        agePlaceholder: "Нас",
        provinceLabel: "Аймаг/Нийслэл сонгох",
        districtLabel: "Сум/Дүүрэг сонгох",
        programLabel: "Хөтөлбөр сонгох",
        partnerLabel: "Харьяалагдах байгууллага",
        programs: ["AND", "EDU", "V", "Одоогоор мэдэхгүй"],
        partnersList: [
            "Volunteer Center Mongolia",
            "Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар",
            "Өмнөговь аймгийн Гэр бүл, Хүүхэд, Залуучуудын хөгжлийн газар",
            "Баянзүрх дүүргийн хүүхэд хөгжлийн хэлтэс",
            "Хан-Уул дүүргийн хүүхэд хөгжлийн хэлтэс",
            "Сонгинохайрхан дүүргийн хүүхэд хөгжлийн хэлтэс",
            "Баянгол дүүргийн хүүхэд хөгжлийн хэлтэс",
            "Багахангай дүүргийн хүүхэд хөгжлийн хэлтэс",
            "Налайх дүүргийн хүүхэд хөгжлийн хэлтэс",
            "GOOD NEIGHBORS Mongolia",
            "Нийслэлийн Засаг даргын Тамгын газар",
            "Нийслэлийн Иргэдийн Төлөөлөгчдийн Хурал",
            "Монголын Улаан Загалмай Нийгэмлэг",
            "Дэлхийн Зөн Монгол",
            "ADRA Mongolia",
            "Дэлхийн Банк",
            "Magic Mascot",
            "Peace Corps Mongolia",
            "Бусад / Хувь хүн"
        ],
        termsAgree: "Би үйлчилгээний нөхцөлийг зөвшөөрч байна.",
        registerButton: "Бүртгүүлэх",
        loginPrompt: "Бүртгэлтэй юу?",
        loginLink: "Нэвтрэх",
        sideTitle: "Бидэнтэй хамтран ажиллагсад:"
    },
    en: {
        heroQuote: "Be part of the change and bring light to your community.",
        title: "Create a New Account",
        fullNamePlaceholder: "Full Name",
        registryPlaceholder: "National Registry ID",
        idPlaceholder: "Username",
        emailPlaceholder: "Email Address",
        passwordPlaceholder: "Password",
        confirmPasswordPlaceholder: "Confirm Password",
        agePlaceholder: "Age",
        provinceLabel: "Select Province/City",
        districtLabel: "Select District/Soum",
        programLabel: "Choose a Program",
        partnerLabel: "Affiliated Organization",
        programs: ["AND", "EDU", "V", "I don't know yet"],
        partnersList: [
            "Volunteer Center Mongolia",
            "Authority for Family, Child, and Youth Development",
            "Umnugovi Family, Child & Youth Development Agency",
            "District Child Dev Depts (BZD, KHUD, SHD, etc.)",
            "GOOD NEIGHBORS Mongolia",
            "Governor's Office of the Capital City",
            "Ulaanbaatar City Council",
            "Mongolian Red Cross Society",
            "World Vision Mongolia",
            "ADRA Mongolia",
            "The World Bank",
            "Magic Mascot",
            "Peace Corps Mongolia",
            "Other / Individual"
        ],
        termsAgree: "I agree to the Terms of Service.",
        registerButton: "Register Now",
        loginPrompt: "Already have an account?",
        loginLink: "Sign In",
        sideTitle: "Participating Organizations:"
    },
};

// --- Animations ---
const staggerContainer = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
};
const itemVariants: Variants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } 
};

// --- Main Register Page ---
const RegisterPage = () => {
    const { language } = useLanguage();
    const t = registerData[language];

    return (
        <SignedOut>
            <section className="min-h-screen flex">
                
                {/* --- Left Column: Hero Image & Partners --- */}
                <div className="hidden lg:flex relative w-1/2 bg-slate-900 flex-col justify-between overflow-hidden">
                    <img src="/volunteers.png" alt="Volunteers" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    
                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative p-12 z-10"
                    >
                        <h2 className="text-4xl font-bold leading-tight text-white mb-4">"{t.heroQuote}"</h2>
                        <div className="w-20 h-1 bg-blue-500 rounded-full"></div>
                    </motion.div>

                    {/* Partners List */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative z-10 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-12 pt-20"
                    >
                        <div className="flex items-center gap-3 mb-6 text-blue-400">
                            <FaHandshake className="text-2xl" />
                            <h3 className="text-lg font-bold uppercase tracking-wider">{t.sideTitle}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-blue-100/70 text-xs">
                            {/* Display first 10-12 partners to keep layout clean */}
                            {t.partnersList.slice(0, 12).map((partner, index) => (
                                <div key={index} className="flex items-start gap-2 group hover:text-white transition-colors">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0"></span>
                                    <span>{partner}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* --- Right Column: Form --- */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-md w-full my-auto"
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-slate-800 mb-6 text-center">{t.title}</motion.h1>
                        <RegisterForm t={t} />
                    </motion.div>
                </div>
            </section>
        </SignedOut>
    );
};

// --- Form Component ---
const RegisterForm: React.FC<{ t: any }> = ({ t }) => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    
    // State
    const [fullName, setFullName] = useState("");
    const [registryNumber, setRegistryNumber] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [age, setAge] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedPartner, setSelectedPartner] = useState(""); // Partner State

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- USE STATIC LOCATIONS ---
    const districts = useMemo(() => {
        if (!selectedProvince) return [];
        // Find province in the imported static array
        const province = mongolianLocations.find(p => p.name === selectedProvince);
        return province ? province.districts : [];
    }, [selectedProvince]);

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || isLoading) return;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await signUp.create({
                emailAddress: email,
                username,
                password,
                unsafeMetadata: {
                    fullName,
                    registryNumber,
                    age: parseInt(age, 10),
                    province: selectedProvince,
                    district: selectedDistrict,
                    program: selectedProgram,
                    partner: selectedPartner, // Save Partner
                },
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);

        } catch (err: any) {
            console.error(err);
            setError(err.errors[0]?.longMessage || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Verify
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded || isLoading) return;
        
        setIsLoading(true);
        setError('');

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });

                // Sync to MongoDB
                try {
                    await fetch('/api/user/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fullName,
                            registryNumber,
                            age, 
                            province: selectedProvince,
                            district: selectedDistrict,
                            program: selectedProgram,
                            partner: selectedPartner // Sync Partner
                        })
                    });
                } catch (syncErr) { console.error(syncErr); }

                router.push("/dashboard");
            } else {
                setError("Verification did not complete.");
            }
        } catch (err: any) {
            setError("Verification failed. Please check code.");
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <form onSubmit={handleVerify} className="space-y-5">
                <p className="text-center text-slate-600">Please enter the verification code sent to <strong>{email}</strong>.</p>
                <motion.div variants={itemVariants}>
                    <InputField type="text" placeholder="Verification Code" icon={FaLock} value={code} onChange={(e: any) => setCode(e.target.value)} />
                </motion.div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <motion.button type="submit" disabled={isLoading} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                    {isLoading ? "Verifying..." : "Verify Email"}
                </motion.button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
                <InputField type="text" placeholder={t.fullNamePlaceholder} icon={FaAddressCard} value={fullName} onChange={(e: any) => setFullName(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type="text" placeholder={t.registryPlaceholder} icon={FaIdCard} value={registryNumber} onChange={(e: any) => setRegistryNumber(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type="text" placeholder={t.idPlaceholder} icon={FaUser} value={username} onChange={(e: any) => setUsername(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type="email" placeholder={t.emailPlaceholder} icon={FaEnvelope} value={email} onChange={(e: any) => setEmail(e.target.value)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type={showPassword ? "text" : "password"} placeholder={t.passwordPlaceholder} icon={FaLock} value={password} onChange={(e: any) => setPassword(e.target.value)} isPassword={true} showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type={showConfirmPassword ? "text" : "password"} placeholder={t.confirmPasswordPlaceholder} icon={FaLock} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} isPassword={true} showPassword={showConfirmPassword} togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <InputField type="number" placeholder={t.agePlaceholder} icon={FaBirthdayCake} value={age} onChange={(e: any) => setAge(e.target.value)} />
            </motion.div>

            {/* Static Province Select */}
            <motion.div variants={itemVariants}>
                 <SelectField 
                    label={t.provinceLabel} 
                    value={selectedProvince} 
                    onChange={(e: any) => { setSelectedProvince(e.target.value); setSelectedDistrict(''); }}
                 >
                    {mongolianLocations.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                 </SelectField>
            </motion.div>
            
            {/* Static District Select */}
             <motion.div variants={itemVariants}>
                 <SelectField label={t.districtLabel} disabled={!selectedProvince} value={selectedDistrict} onChange={(e: any) => setSelectedDistrict(e.target.value)}>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                 </SelectField>
            </motion.div>

            {/* Partner Select */}
            <motion.div variants={itemVariants}>
                 <SelectField label={t.partnerLabel} icon={FaBuilding} value={selectedPartner} onChange={(e: any) => setSelectedPartner(e.target.value)}>
                    {t.partnersList.map((p: string) => <option key={p} value={p}>{p}</option>)}
                 </SelectField>
            </motion.div>

             <motion.div variants={itemVariants}>
                 <SelectField label={t.programLabel} value={selectedProgram} onChange={(e: any) => setSelectedProgram(e.target.value)}>
                    {t.programs.map((p: string) => <option key={p} value={p}>{p}</option>)}
                 </SelectField>
            </motion.div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <motion.div variants={itemVariants} className="pt-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="text-sm text-slate-700">{t.termsAgree}</span>
                </label>
            </motion.div>

            <motion.div variants={itemVariants}>
                <motion.button type="submit" disabled={!isLoaded || isLoading} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                    {isLoading ? "Registering..." : t.registerButton}
                </motion.button>
            </motion.div>

             <motion.p variants={itemVariants} className="text-center text-slate-600">
                {t.loginPrompt} <Link href="/sign-in" className="font-semibold text-blue-600 hover:underline">{t.loginLink}</Link>
            </motion.p>
        </form>
    );
};

// --- Helpers ---
const InputField: React.FC<any> = ({ icon: Icon, isPassword, showPassword, togglePassword, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input {...props} required className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
        {isPassword && <button type="button" onClick={togglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><Icon/></button>}
    </div>
);

const SelectField: React.FC<{ label: string; children: React.ReactNode; icon?: React.ElementType; [key: string]: any }> = ({ label, children, icon: Icon, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
        <div className="relative">
             {Icon ? <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /> : <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
             <select {...props} required className="w-full appearance-none bg-white border-2 border-slate-300 rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-slate-100">
                <option value="" disabled>{label}</option>
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

export default RegisterPage;