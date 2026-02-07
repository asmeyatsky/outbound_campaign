import React, { useState } from 'react';
import { Search, MapPin, Play, CheckCircle2, Clock, Mail } from 'lucide-react';
import { startScrape } from '../api';

const Dashboard = () => {
    const [isScraping, setIsScraping] = useState(false);
    const [city, setCity] = useState('');

    const handleScrape = async () => {
        if (!city) return;
        setIsScraping(true);
        try {
            await startScrape(city);
            alert(`Scrape started for ${city}. New leads will appear in the Leads tab shortly.`);
            setCity('');
        } catch (error) {
            console.error('Scrape error:', error);
            alert('Failed to start scrape.');
        } finally {
            setIsScraping(false);
        }
    };

    const stats = [
        { label: 'Total Leads', value: '1,284', icon: Search, color: 'text-blue-400' },
        { label: 'Outreach Sent', value: '412', icon: Mail, color: 'text-purple-400' },
        { label: 'Responses', value: '28', icon: CheckCircle2, color: 'text-emerald-400' },
        { label: 'Pending', value: '872', icon: Clock, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
                <p className="text-slate-400">Monitor your gear rental lead generation and outreach campaigns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-white">Start New Discovery</h2>
                                <p className="text-slate-400 text-sm">Target a new location to find professional camera rental shops.</p>
                            </div>

                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Enter city (e.g. London, Cape Town, NYC)"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleScrape}
                                    disabled={isScraping || !city}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    {isScraping ? 'Scraping...' : 'Begin Scrape'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h3 className="font-semibold text-white">Recent Activity</h3>
                        <div className="space-y-4 text-sm">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500" />
                                    <div className="flex flex-col">
                                        <span className="text-slate-300">Fetched 42 leads for Cape Town</span>
                                        <span className="text-slate-500 text-xs">2 hours ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
