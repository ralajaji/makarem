import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Admin = () => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, New, Contacted, Completed

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching requests:', error);
        } else {
            setRequests(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Force light mode
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

        fetchRequests();

        // Optional: Realtime subscription could be added here
    }, [language]);

    const updateStatus = async (id, newStatus) => {
        // Optimistic update
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));

        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            // Revert changes if needed or just alert
            alert('Failed to update status');
            fetchRequests();
        }
    };

    const getIcon = (serviceType) => {
        switch (serviceType) {
            case 'car': return 'directions_car';
            case 'gift': return 'card_giftcard';
            case 'activity': return 'explore';
            case 'restaurant': return 'restaurant';
            default: return 'concierge';
        }
    };

    const getTitle = (req) => {
        const typeLabel = t.admin.serviceType[req.service_type] || req.service_type;

        switch (req.service_type) {
            case 'car': return `${typeLabel} (${req.car_type || ''})`;
            case 'gift': return `${typeLabel}: ${req.gift_name || ''}`;
            case 'activity': return `${typeLabel}: ${req.activity_name || ''}`;
            case 'restaurant': return `${typeLabel}: ${req.restaurant_name || ''}`;
            default: return typeLabel;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);

        if (diffInMinutes < 60) return `${diffInMinutes} ${t.admin.minsAgo}`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t.admin.hoursAgo}`;
        return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status.toLowerCase() === filter.toLowerCase());

    return (
        <div className="min-h-screen bg-gray-50 font-body text-gray-900 flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">admin_panel_settings</span>
                    <h1 className="text-xl font-bold text-primary">{t.admin.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => toggleLanguage()}
                        className="text-sm font-bold text-primary hover:bg-gray-100 px-3 py-1 rounded transition-colors"
                    >
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                    <button
                        onClick={fetchRequests}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <span className="material-icons-outlined">refresh</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-1">{t.admin.dashboard}</h2>
                        <p className="text-gray-500 text-sm">{t.admin.subtitle}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
                    {['All', 'New', 'Contacted', 'Completed'].map(status => {
                        let label = status;
                        if (status === 'All') label = t.admin.allRequests;
                        if (status === 'New') label = t.admin.new;
                        if (status === 'Contacted') label = t.admin.contacted;
                        if (status === 'Completed') label = t.admin.completed;

                        return (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${filter === status ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center py-10 text-gray-400">{t.admin.loading}</p>
                    ) : filteredRequests.length === 0 ? (
                        <p className="text-center py-10 text-gray-400">{t.admin.noRequests}</p>
                    ) : (
                        filteredRequests.map(req => (
                            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <span className="material-icons-outlined text-3xl">{getIcon(req.service_type)}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-lg">{getTitle(req)}</h3>
                                            {req.status === 'new' && (
                                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{t.admin.new}</span>
                                            )}
                                        </div>
                                        <p className="text-primary font-semibold text-sm">{t.admin.room} {req.room_number}</p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">call</span>
                                                <span dir="ltr">{req.phone_number}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">schedule</span>
                                                {formatDate(req.created_at)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">language</span>
                                                <span className="uppercase">{req.language}</span>
                                            </div>
                                        </div>
                                        {req.notes && (
                                            <p className="mt-2 text-xs italic text-gray-600 bg-gray-50 p-2 rounded">
                                                <span className="font-bold not-italic">{t.admin.notes}:</span> "{req.notes}"
                                            </p>
                                        )}
                                        {/* Specific fields display */}
                                        {req.delivery_date && (
                                            <p className="text-xs text-gray-500 mt-1">{t.admin.delivery}: {formatDate(req.delivery_date)}</p>
                                        )}
                                        {req.pickup_time && (
                                            <p className="text-xs text-gray-500 mt-1">{t.cars.pickupTime}: {formatDate(req.pickup_time)}</p>
                                        )}
                                        {req.preferred_time && (
                                            <p className="text-xs text-gray-500 mt-1">{t.activities.prefTime}: {formatDate(req.preferred_time)}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="flex bg-gray-100 p-1 rounded-lg shrink-0 w-full md:w-auto">
                                    {['Refused', 'new', 'contacted', 'completed'].map(status => {
                                        if (status === 'Refused') return null; // Logic from previous file

                                        const isActive = req.status === status;
                                        let label = status;
                                        if (status === 'new') label = t.admin.new;
                                        if (status === 'contacted') label = t.admin.contacted;
                                        if (status === 'completed') label = t.admin.completed;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(req.id, status)}
                                                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${isActive ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
