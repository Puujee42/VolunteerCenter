"use client";

import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import Link from "next/link";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added Eye icons
import { useSignIn } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation"; 

// --- Bilingual Data Store ---
const loginData = {
  mn: {
    heroQuote: "Ганц хүн дэлхийг өөрчилж чадахгүй, гэхдээ бид хамтдаа чадна.",
    title: "Системд нэвтрэх",
    subtitle: "Үргэлжлүүлэхийн тулд хэрэглэгчийн нэр, нууц үгээ оруулна уу.",
    idPlaceholder: "Хэрэглэгчийн нэр эсвэл ID",
    passwordPlaceholder: "Нууц үг",
    forgotPassword: "Нууц үгээ мартсан уу?",
    loginButton: "Нэвтрэх",
    signupPrompt: "Бүртгэлгүй юу?",
    signupLink: "Шинээр бүртгүүлэх",
  },
  en: {
    heroQuote: "One person can't change the world, but together, we can.",
    title: "System Access",
    subtitle: "Please enter your ID and password to continue.",
    idPlaceholder: "Username or ID",
    passwordPlaceholder: "Password",
    forgotPassword: "Forgot Password?",
    loginButton: "Sign In",
    signupPrompt: "Don't have an account?",
    signupLink: "Register now",
  },
};

// --- Main Login Page Component ---
const LoginPage = () => {
  const { language } = useLanguage();
  const t = loginData[language];

  return (
    <section className="min-h-screen flex">
      {/* --- Left Column: Hero Image & Quote --- */}
      <div className="hidden lg:block relative w-1/2 bg-cover bg-center">
        <img src="/volunteering.png" alt="Volunteers working together" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/60" />
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="relative h-full flex flex-col justify-end p-12 text-white"
        >
          <h2 className="text-4xl font-bold leading-tight max-w-md">
            "{t.heroQuote}"
          </h2>
        </motion.div>
      </div>

      {/* --- Right Column: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-md w-full"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold text-slate-800 mb-2">{t.title}</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-600 mb-8">{t.subtitle}</motion.p>
          
          <LoginForm t={t} />

        </motion.div>
      </div>
    </section>
  );
};

// --- Sub-Component for the Form ---
const LoginForm: React.FC<{ t: any }> = ({ t }) => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await signIn.create({
                identifier,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                console.log(result);
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0]?.longMessage || "Sign-in failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
                 <InputField 
                    type="text" 
                    placeholder={t.idPlaceholder} 
                    icon={FaUser} 
                    value={identifier} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)} 
                 />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                 <InputField 
                    // Dynamic type based on state
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.passwordPlaceholder} 
                    icon={FaLock} 
                    value={password} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    // Props for password toggle functionality
                    isPassword={true}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                 />
            </motion.div>

            {error && <p className="text-red-500 text-sm text-center -mt-2 mb-2">{error}</p>}

            <motion.div variants={itemVariants} className="text-right">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">{t.forgotPassword}</a>
            </motion.div>
            <motion.div variants={itemVariants}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                    {isLoading ? "Signing In..." : t.loginButton}
                </motion.button>
            </motion.div>
             <motion.p variants={itemVariants} className="text-center text-slate-600 pt-4">
                {t.signupPrompt} <Link href="/sign-up" className="font-semibold text-blue-600 hover:underline">{t.signupLink}</Link>
            </motion.p>
        </form>
    );
}

// --- Updated Input Field Component ---

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
    isPassword?: boolean;
    showPassword?: boolean;
    togglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ 
    icon: Icon, 
    isPassword = false, 
    showPassword = false, 
    togglePassword, 
    ...props 
}) => (
    <div className="relative">
        {/* Left Icon */}
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        
        {/* Input Field */}
        <input 
            {...props} 
            required 
            // Add extra padding on the right if it's a password field so text doesn't hit the eye icon
            className={`w-full bg-white border-2 border-slate-300 rounded-lg py-3 pl-12 ${isPassword ? 'pr-12' : 'pr-4'} focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition`} 
        />

        {/* Password Toggle Button (Eye Icon) */}
        {isPassword && (
            <button
                type="button" // Important to prevent form submission
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
        )}
    </div>
);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants= {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default LoginPage;