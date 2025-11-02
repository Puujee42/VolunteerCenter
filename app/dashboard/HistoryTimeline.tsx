"use client";

import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';
import { Card, CardHeader } from './Card';
import { HistoryItem } from './data/dashboardData';
import React from 'react';

interface HistoryTimelineProps {
  history: HistoryItem[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader 
        icon={FaClipboardList} 
        title="Volunteering History"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <div className="relative pl-6">
        {/* The timeline vertical line */}
        <div className="border-l-2 border-slate-200 absolute h-full top-0 left-10"></div>
        {history.map((item, index) => (
          <motion.div 
            key={index} 
            className="flex items-start mb-8 last:mb-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-purple-600 rounded-full h-8 w-8 flex items-center justify-center z-10 mr-6 flex-shrink-0 ring-4 ring-white">
              <item.icon className="text-white text-lg" />
            </div>
            <div>
              <p className="font-semibold text-slate-500 text-sm">{item.date}</p>
              <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
              <p className="text-slate-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};