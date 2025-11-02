"use client";

import { FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake } from 'react-icons/fa';
import { Card, CardHeader } from './Card';
import React from 'react';

// Define the component's props interface
interface SimpleUser {
  id: string;
  firstName: string | null;
  username: string | null;
}
interface ProfileCardProps {
  user: SimpleUser;
  age: number | string;
  province: string;
  district: string;
  program: string;
}

// A small helper component local to this file
const InfoItem: React.FC<{ icon: React.ElementType, label: string, value: string, isCode?: boolean }> = ({ icon: Icon, label, value, isCode }) => (
  <div className="flex items-start">
    <Icon className="text-xl text-blue-500 mt-1 mr-4 flex-shrink-0" />
    <div>
      <p className="font-semibold text-slate-600">{label}</p>
      {isCode ? (
        <code className="text-sm text-slate-800 bg-slate-100 p-1 rounded-md font-mono">{value}</code>
      ) : (
        <p className="text-lg text-slate-800">{value}</p>
      )}
    </div>
  </div>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, age, province, district, program }) => {
  return (
    <Card>
      <CardHeader 
        icon={FaUserCircle} 
        title="Your Profile Details"
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <div className="grid grid-cols-1 gap-6">
        <InfoItem icon={FaBirthdayCake} label="Age" value={age.toString()} />
        <InfoItem icon={FaTasks} label="Program of Interest" value={program} />
        <InfoItem icon={FaMapMarkedAlt} label="Location" value={`${district}, ${province}`} />
        <InfoItem icon={FaUserCircle} label="User ID" value={user.id} isCode={true} />
      </div>
    </Card>
  );
};