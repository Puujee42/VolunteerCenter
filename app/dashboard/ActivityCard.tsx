"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from './Card';
import { FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { userActivities, Activity } from './data/dashboardData'; // Import data
import { DateRange, DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css'; // Import stylesheet

// Helper to check if a date is within a range
const isDateInRange = (date: Date, range: DateRange): boolean => {
  const { from, to } = range;
  if (!from) return false;
  if (!to) return from.toDateString() === date.toDateString(); // Handle single day selection
  return date >= from && date <= to;
};

export const ActivityCard = () => {
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });

  // Filter activities based on the selected date range
  const filteredActivities = useMemo(() => {
    if (!range?.from) return [];
    return userActivities.filter(activity => isDateInRange(new Date(activity.date), range));
  }, [range]);
  
  // Calculate summary stats
  const totalPoints = filteredActivities.reduce((sum, act) => sum + act.points, 0);

  return (
    <Card>
      <CardHeader 
        icon={FaHistory} 
        title="Activity Overview"
        iconBgColor="bg-indigo-100"
        iconColor="text-indigo-600"
      />

      <div className="mb-6">
        <h3 className="font-semibold text-slate-600 mb-2">Select Date Range</h3>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={today}
          footer={
             <p className="text-center text-sm text-slate-500 mt-2">
               {range?.from ? (
                 range.to ? `Selected: ${format(range.from, 'LLL d, y')} - ${format(range.to, 'LLL d, y')}` : `Selected: ${format(range.from, 'LLL d, y')}`
               ) : `Please pick a date range.`}
             </p>
          }
        />
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="font-semibold text-slate-600 mb-4">
            Summary for Period ({filteredActivities.length} activities)
        </h3>
        {filteredActivities.length > 0 ? (
          <ul className="space-y-3">
             {filteredActivities.map(activity => (
              <li key={activity.id} className="flex justify-between items-center text-slate-700">
                <span>{activity.title} <span className="text-xs bg-slate-100 p-1 rounded">{activity.category}</span></span>
                <span className="font-bold text-indigo-600">+{activity.points} pts</span>
              </li>
            ))}
             <li className="flex justify-between items-center text-slate-800 font-bold border-t border-slate-200 pt-3 mt-3">
                <span>Total Points</span>
                <span>{totalPoints}</span>
            </li>
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-4">No activities recorded in this period.</p>
        )}
      </div>
    </Card>
  );
};