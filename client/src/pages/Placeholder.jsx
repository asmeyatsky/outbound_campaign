import React from 'react';

const Placeholder = ({ title }) => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-slate-500">
            <p>Component implementation in progress...</p>
        </div>
    </div>
);

export const Leads = () => <Placeholder title="Leads Management" />;
export const Campaigns = () => <Placeholder title="Campaign Tracking" />;
export const Settings = () => <Placeholder title="System Settings" />;

export default Placeholder;
