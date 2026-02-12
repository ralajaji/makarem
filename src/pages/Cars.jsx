import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { formatSupabaseDate } from '../lib/utils';

const Cars = () => {
    const { roomNumber } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    // State
    const [selectedCarType, setSelectedCarType] = useState(null); // 'chauffeur' | 'self-drive' | null
    const [phone, setPhone] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const pickupTime = formatSupabaseDate(time); // Returns ISO string or null
        const finalTime = pickupTime || new Date().toISOString(); // Default to now if not provided (ASAP)

        try {
            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        service_type: 'car',
                        room_number: roomNumber,
                        phone_number: phone,
                        language: language,
                        status: 'new',
                        car_type: selectedCarType,
                        pickup_time: finalTime,
                        notes: notes,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            navigate(`/${roomNumber}/confirmation`);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(language === 'ar' ? 'فشل في إرسال الطلب. حاول مرة أخرى.' : 'Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-10 animate-fade-in text-gray-900">
            <div className="text-center mb-8">
                <h1 className="font-heading text-3xl font-bold mb-2 text-primary">{t.cars.title}</h1>
                <p className="text-gray-500 text-sm">{t.cars.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Chauffeur Option */}
                <div
                    onClick={() => setSelectedCarType('chauffeur')}
                    className={`relative group cursor-pointer border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-white ${selectedCarType === 'chauffeur' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                >
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            alt={t.cars.chauffeur}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxqZbqjXa0-v9I9xOSJy-Ag2CMXuZ63aLAdY3fC4NjD_KAvyUdtco3DeysjTM9kARTshNDk1mpq9WFSSxXH5AGjpEZK4WEWmqm3d7VnLRD8-YdZcesE23WCtEPAKAioH-cusQXB4284e-ZE4iRmAykyvlwT0dGxg-unLviLBh2BdTvWChtEn9klQoaxTLmx893CSrEgCkQkmGuhJlXsaYLX3amjNT-iB9K7KWg4JAWUPlBRyf_9xOqSi1khdpXS0xSNhZMdjqiZKuc"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base font-bold text-gray-900">{t.cars.chauffeur}</h3>
                            {selectedCarType === 'chauffeur' && <span className="material-icons-outlined text-primary">check_circle</span>}
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                            {t.cars.chauffeurDesc}
                        </p>
                    </div>
                </div>

                {/* Self-Drive Option */}
                <div
                    onClick={() => setSelectedCarType('self-drive')}
                    className={`relative group cursor-pointer border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-white ${selectedCarType === 'self-drive' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                >
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            alt={t.cars.selfDrive}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIgZ8-PreIlPmeBI6V9Pu3FFzhmPup0_Q9mssQboLjv_2FgHqy8aWwHvwCJpn9ua3wcO6E-yoB0Qd_QHNERwzQ5jNADxhMl707H4zAiy1CF811zZUH5PDFdfTeLz0Mp2kTgSK-7I5WXhEP385BzdifCv63YHzkcT9LrW2pymHwhURnzV40qSAWEy6193rl7HitlJ0D7jVupgmwVBgWQjaVhphHIlla4Vk7UtCkwo3DUPl9sweR2dQN-SjJkrCtUG2nGfyr6Jk8SF9O"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base font-bold text-gray-900">{t.cars.selfDrive}</h3>
                            {selectedCarType === 'self-drive' && <span className="material-icons-outlined text-primary">check_circle</span>}
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                            {t.cars.selfDriveDesc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet Form */}
            {selectedCarType && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in" onClick={() => setSelectedCarType(null)}>
                    <div className="bg-white w-full max-w-2xl mx-auto rounded-t-[32px] shadow-2xl p-8 border-t border-gray-100 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 cursor-pointer" onClick={() => setSelectedCarType(null)}></div>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-heading text-2xl font-bold text-primary">{t.cars.stepTitle}</h2>
                            <button onClick={() => setSelectedCarType(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <span className="material-icons-outlined text-gray-500">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">{t.common.contactPhone} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className={`absolute ${language === 'ar' ? 'end-4' : 'start-4'} top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400`}>phone</span>
                                    <input
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-gray-900`}
                                        placeholder="+966 50 000 0000"
                                        type="tel"
                                        dir="ltr" // Phone always LTR
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">{t.cars.pickupTime} ({t.common.optional})</label>
                                    <div className="relative">
                                        <span className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-xl`}>schedule</span>
                                        <input
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-gray-900`}
                                            type="time"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">{t.common.notes} ({t.common.optional})</label>
                                    <div className="relative">
                                        <span className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-4 material-icons-outlined text-gray-400 text-xl`}>edit_note</span>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-gray-900 min-h-[100px] resize-none`}
                                            placeholder="..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                type="submit"
                            >
                                <span>{isLoading ? t.common.sending : t.common.sendRequest}</span>
                                {!isLoading && <span className={`material-icons-outlined ${language === 'ar' && 'transform rotate-180'}`}>arrow_forward</span>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cars;
