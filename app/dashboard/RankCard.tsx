"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader } from './Card';
import { RankData } from './data/dashboardData';
import React from 'react';

interface RankCardProps {
  rankData: RankData;
}

export const RankCard: React.FC<RankCardProps> = ({ rankData }) => {
  return (
    <Card>
      <CardHeader 
        icon={rankData.rankIcon} 
        title="Your Rank"
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-500"
      />
      <div className="text-center">
        <h3 className="text-4xl font-bold text-yellow-500">{rankData.rank}</h3>
        <p className="text-slate-500 mt-1">Next rank in {100 - rankData.progress}%</p>
        <div className="w-full bg-slate-200 rounded-full h-4 mt-4 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full" 
            initial={{ width: 0 }}
            whileInView={{ width: `${rankData.progress}%` }}
            transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 50 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </Card>
  );
};