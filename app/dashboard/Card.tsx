"use client";
import { motion } from 'framer-motion';
import React from 'react';

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-100 ${className}`}
      variants={itemVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

// Reusable Card Header
interface CardHeaderProps {
  icon: React.ElementType;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ icon: Icon, title, iconBgColor = 'bg-blue-100', iconColor = 'text-blue-600' }) => (
  <div className="flex items-center mb-6">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${iconBgColor}`}>
      <Icon className={`text-2xl ${iconColor}`} />
    </div>
    <h2 className="text-2xl font-semibold text-slate-700">{title}</h2>
  </div>
);