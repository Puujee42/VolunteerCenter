"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from './Card';
import { opportunities, Opportunity } from './data/dashboardData';
import { FaSearch, FaTag } from 'react-icons/fa';

const causes = ['All', ...Array.from(new Set(opportunities.map(op => op.cause)))];

// A single card for an opportunity
const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
    const isFull = opportunity.slots.filled >= opportunity.slots.total;
    const progress = (opportunity.slots.filled / opportunity.slots.total) * 100;

    return (
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    opportunity.cause === 'Environment' ? 'bg-green-100 text-green-800' :
                    opportunity.cause === 'Animals' ? 'bg-orange-100 text-orange-800' :
                    opportunity.cause === 'Education' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                    {opportunity.cause}
                </span>
                <h4 className="font-bold text-slate-800 text-lg mt-2">{opportunity.title}</h4>
                <p className="text-sm text-slate-500">{opportunity.date} @ {opportunity.location}</p>
                <p className="text-slate-600 text-sm mt-2 mb-4">{opportunity.description}</p>
            </div>
            <div>
                <div className="text-sm font-semibold text-slate-600 mb-1">{opportunity.slots.filled} / {opportunity.slots.total} spots filled</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <button 
                    disabled={isFull}
                    className="w-full mt-4 text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {isFull ? 'Event Full' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};


export const OpportunityHub = () => {
    const [activeCause, setActiveCause] = useState('All');
    
    const filteredOpportunities = useMemo(() => {
        if (activeCause === 'All') return opportunities;
        return opportunities.filter(op => op.cause === activeCause);
    }, [activeCause]);

    return (
        <Card>
            <CardHeader 
                icon={FaSearch}
                title="Opportunity Hub"
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
            />
            <div className="mb-6 flex flex-wrap gap-2">
                {causes.map(cause => (
                    <button 
                        key={cause}
                        onClick={() => setActiveCause(cause)}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                            activeCause === cause 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        {cause}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map(op => <OpportunityCard key={op.id} opportunity={op} />)
                ) : (
                    <p className="text-slate-500 text-center md:col-span-2">No opportunities match this filter.</p>
                )}
            </div>
        </Card>
    )
}