import React, { useState, useEffect } from 'react';
import { getLeads } from '../api';
import { Mail, Phone, Globe, MapPin, ExternalLink, Filter } from 'lucide-react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await getLeads();
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Leads Inventory</h1>
                    <p className="text-slate-400">Manage and filter your gathered rental shop leads.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button
                        onClick={fetchLeads}
                        className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-medium hover:bg-indigo-500/30 transition-all"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="py-20 text-center rounded-3xl border border-dashed border-white/10 text-slate-500">
                        No leads found. Start a scrape from the dashboard.
                    </div>
                ) : (
                    leads.map((lead) => (
                        <div key={lead.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${lead.status === 'contact_found'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                            }`}>
                                            {lead.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-500" />
                                            <span className="truncate">{lead.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-500" />
                                            <span className={lead.email ? 'text-slate-200' : 'italic text-slate-600'}>
                                                {lead.email || 'No email found'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-500" />
                                            <span>{lead.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-slate-500" />
                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 flex items-center gap-1">
                                                {lead.website?.replace(/^https?:\/\//, '')}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end lg:self-center">
                                    <button
                                        disabled={!lead.email}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        Add to Campaign
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leads;
