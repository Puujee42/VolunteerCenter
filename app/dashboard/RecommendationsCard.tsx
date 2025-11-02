"use client";

import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { Card, CardHeader } from './Card';
import { Recommendation } from './data/dashboardData';
import React from 'react';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  return (
    <Card>
      <CardHeader 
        icon={FaLightbulb} 
        title="Recommendations"
        iconBgColor="bg-teal-100"
        iconColor="text-teal-600"
      />
      <div className="flex flex-col gap-6">
        {recommendations.map((rec, index) => (
          <motion.div 
            key={index} 
            className="flex items-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-teal-500 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center mr-4 mt-1 ring-4 ring-white">
              <rec.icon className="text-white text-lg" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">{rec.title}</h4>
              <p className="text-slate-600">{rec.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};