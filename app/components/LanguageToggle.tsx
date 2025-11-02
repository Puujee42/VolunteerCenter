// components/LanguageToggle.tsx
"use client";

import { motion } from "framer-motion";
import { FaLanguage } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
   <></>
  );
};

export default LanguageToggle;