"use client";

import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  FaUser, 
  FaLock, 
  FaMapMarkerAlt, 
  FaBirthdayCake, 
  FaEnvelope, 
  FaIdCard, 
  FaAddressCard,
  FaEye,
  FaEyeSlash,
  FaBuilding // Icon for Organization
} from "react-icons/fa";
import { SignedOut, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
        partnerLabel: "Харьяалагдах байгууллага", // New Label
        programs: ["AND", "EDU", "V", "Одоогоор мэдэхгүй"],
        // Added Volunteer Center Mongolia and "Other" option
        partnersList: [
            "Volunteer Center Mongolia", // Requested Addition
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
            "Бусад / Хувь хүн" // Option for individuals
        ],
        termsAgree: "Би үйлчилгээний нөхцөлийг зөвшөөрч байна.",
        registerButton: "Бүртгүүлэх",
        loginPrompt: "Бүртгэлтэй юу?",
        loginLink: "Нэвтрэх",
        loadingLocations: "Байршил уншиж байна...",
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
        partnerLabel: "Affiliated Organization", // New Label
        programs: ["AND", "EDU", "V", "I don't know yet"],
        // English translations for the list
        partnersList: [
            "Volunteer Center Mongolia",
            "Authority for Family, Child, and Youth Development",
            "Umnugovi Family, Child & Youth Development Agency",
            "District Child Development Departments (BZD, KHUD, SHD, BGD, etc.)",
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
        loadingLocations: "Loading locations...",
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

// --- Main Register Page Component ---
const RegisterPage = () => {
    const { language } = useLanguage();
    const t = registerData[language];

    return (
        <SignedOut>
            <section className="min-h-screen flex">
                {/* --- Left Column: Hero Image --- */}
                <div className="hidden lg:block relative w-1/2 bg-cover bg-center">
                    <img src="/volunteers.png" alt="A community of volunteers" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-blue-900/60" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        className="relative h-full flex flex-col justify-end p-12 text-white"
                    >
                        <h2 className="text-4xl font-bold leading-tight max-w-md">"{t.heroQuote}"</h2>
                    </motion.div>
                </div>

                {/* --- Right Column: Register Form --- */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-md w-full"
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-slate-800 mb-6 text-center">{t.title}</motion.h1>
                        <RegisterForm t={t} />
                    </motion.div>
                </div>
            </section>
        </SignedOut>
    );
};

// --- Sub-Components ---

const RegisterForm: React.FC<{ t: any }> = ({ t }) => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    
    // State Variables
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
    
    // NEW: Partner State
    const [selectedPartner, setSelectedPartner] = useState("");

    // Locations State
    const [locations, setLocations] = useState<any[]>([]);
    const [loadingLocs, setLoadingLocs] = useState(true);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- FETCH LOCATIONS FROM DB ---
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('/api/locations');
                const data = await res.json();
                if (data.success) {
                    setLocations(data.locations);
                }
            } catch (err) {
                console.error("Failed to load locations", err);
            } finally {
                setLoadingLocs(false);
            }
        };
        fetchLocations();
    }, []);

    // Get selected location data (including lat/lng)
    const selectedLocationData = useMemo(() => {
        return locations.find(l => l.name === selectedProvince);
    }, [locations, selectedProvince]);

    // Dynamic Districts
    const districts = useMemo(() => {
        if (!selectedProvince || locations.length === 0) return [];
        const province = locations.find(p => p.name === selectedProvince);
        return province ? province.districts : [];
    }, [selectedProvince, locations]);

    // --- 1. Handle Submit ---
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
                    partner: selectedPartner, // Save Partner to Clerk
                    // Save coordinates so we don't need to look them up later
                    location: selectedLocationData ? { 
                        lat: selectedLocationData.lat, 
                        lng: selectedLocationData.lng 
                    } : null
                },
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);

        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0]?.longMessage || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. Handle Verify ---
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
                            partner: selectedPartner, // Save Partner to MongoDB
                            coordinates: selectedLocationData ? {
                                lat: selectedLocationData.lat,
                                lng: selectedLocationData.lng
                            } : null
                        })
                    });
                } catch (syncErr) {
                    console.error("Database sync error:", syncErr);
                }

                router.push("/dashboard");
            } else {
                setError("Verification did not complete. Please try signing in.");
            }
        } catch (err: any) {
            setError(err.errors[0]?.longMessage || "Verification failed. Please check the code and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <form onSubmit={handleVerify} className="space-y-5">
                <p className="text-center text-slate-600">Please enter the verification code sent to <strong>{email}</strong>.</p>
                <motion.div variants={itemVariants}>
                    <InputField 
                        type="text" 
                        placeholder="Verification Code" 
                        icon={FaLock} 
                        value={code} 
                        onChange={(e: any) => setCode(e.target.value)} 
                    />
                </motion.div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <motion.button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-4 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400"
                >
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

            {/* Province Select from DB */}
            <motion.div variants={itemVariants}>
                 <SelectField 
                    label={loadingLocs ? t.loadingLocations : t.provinceLabel} 
                    value={selectedProvince} 
                    onChange={(e: any) => { setSelectedProvince(e.target.value); setSelectedDistrict(''); }}
                    disabled={loadingLocs}
                 >
                    {locations.map((p: any) => <option key={p._id || p.name} value={p.name}>{p.name}</option>)}
                 </SelectField>
            </motion.div>
            
            {/* District Select from DB */}
             <motion.div variants={itemVariants}>
                 <SelectField label={t.districtLabel} disabled={!selectedProvince} value={selectedDistrict} onChange={(e: any) => setSelectedDistrict(e.target.value)}>
                    {districts.map((d: string) => <option key={d} value={d}>{d}</option>)}
                 </SelectField>
            </motion.div>

            {/* NEW: Partner Organization Select */}
            <motion.div variants={itemVariants}>
                 <SelectField 
                    label={t.partnerLabel} 
                    icon={FaBuilding}
                    value={selectedPartner} 
                    onChange={(e: any) => setSelectedPartner(e.target.value)}
                 >
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

// --- Helper Components ---

const InputField: React.FC<any> = ({ icon: Icon, isPassword = false, showPassword = false, togglePassword, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input {...props} required className="w-full bg-white border-2 border-slate-300 rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
        {isPassword && (
            <button type="button" onClick={togglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        )}
    </div>
);

const SelectField: React.FC<{
    label: string;
    children: React.ReactNode;
    icon?: React.ElementType;
    [key: string]: any;
}> = ({ label, children, icon: Icon, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
        <div className="relative">
             {Icon ? <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /> : <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
             <select {...props} required className="w-full appearance-none bg-white border-2 border-slate-300 rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-slate-100">
                <option value="" disabled>{label}</option>
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

export default RegisterPage;