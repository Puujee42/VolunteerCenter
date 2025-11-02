"use client";

import { FaChartPie } from 'react-icons/fa';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { Card, CardHeader } from './Card';

interface Strength {
  skill: string;
  value: number;
}

interface StrengthsRadarChartProps {
  strengths: Strength[];
}

export const StrengthsRadarChart: React.FC<StrengthsRadarChartProps> = ({ strengths }) => {
  return (
    <Card>
      <CardHeader 
        icon={FaChartPie} 
        title="Your Strengths"
        iconBgColor='bg-green-100'
        iconColor='text-green-600'
      />
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengths}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 14 }} />
            <Radar 
              name="Score" 
              dataKey="value" 
              stroke="#2563eb" 
              fill="#3b82f6" 
              fillOpacity={0.6} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};