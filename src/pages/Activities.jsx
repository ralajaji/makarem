import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { formatSupabaseDate } from '../lib/utils';

const ACTIVITIES_DATA = [
    {
        id: 1,
        name: { en: "Dune Bashing Safari", ar: "سفاري التطعيس" },
        location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
        price: { en: "From SAR 450", ar: "من 450 ريال" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVC1nqD1TuSSQaDada3sYxjqzAGceygBuIWMf7E0kx6NKdniJ5o73_7ilwl6L8FadRR1kNykiMEDxJQKknrYtAlNjoTpSnGXLrgAJwcoCQbkLQfEpyAwXAiwd9te5M4RwbbFcMGRkn9N1CvkW3VrUhIifRomoUArOgotL8fyDPqMz4NCsXI_2AxvRpiBDyNx-Lujd0tsxl6xNRnB9pBhj50gsmcW5S2DatsWW6wRLC9b95gQsUcFry5kTYyqNUArPgwkMlyTfsTwv0"
    },
    {
        id: 2,
        name: { en: "Historical Diriyah Tour", ar: "جولة الدرعية التاريخية" },
        location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
        price: { en: "From SAR 300", ar: "من 300 ريال" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1TjFRyo9HkTu1w7hpIu2xIqHTwe7o8Ac-8KGPIpsgqwWgjaSXYVVj4zErsNL3l2B0iNsXvL1m5z9LZYH9VV-exJw7IMx-A9e5CKjmDYK50vsj4cU6fpoc7URCzZLzROwq7_yp2rvYgajY4mFzFLg4BNPNNRNmtPWPYPqTlk7PbUq8PkpcvUIE-y257FdLP7AaZvj7uPT0_Z5d8JBrXaf98RXJ0C1unLDY7-K0S5gvABtY8yfe5C_jd4gFQlyoQ0rW3lrQCRYOCUP7"
    },
    {
        id: 3,
        name: { en: "Sky Bridge Experience", ar: "تجربة جسر السماء" },
        location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
        price: { en: "From SAR 120", ar: "من 120 ريال" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoVaQZYxpTB0rDlwCDJN5gXhG1mEuxYgJGvP7K5p9OdWw4Edyh-B8iROIWUN-DpP0O1s5QEZsAunMq1IAi1TGsWSS3mmpBXLlRQ4iZVGWDCQj1Zn-lgZScHPxiXHgX7T-6xdP9YDE9851Kh9q4TEK8ghTrzD6DWnnCbpLzO7l9WWldYv91nx4ThZ_Don_5ekhiurZ5bqa18h32xVcXhIrHitlHVT1_cE9aSYiPIqcCxm8PJoipwYXIuC7nfCcsHwyBowzBrZgWaU9X"
    },
    {
        id: 4,
        name: { en: "Coffee & Dates Tasting", ar: "تجربة القهوة والتمور" },
        location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
        price: { en: "From SAR 150", ar: "من 150 ريال" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCicf98U0YwA0Tl99l9fL-Txyqxx3sKMShyoyCfiDDokvaXTleylyRKmKwFiDcyYBDjv7j5pkh-rNlOG_XAr623gd7U48123WlKhbVSx1gLOwwoFJdcxi-3zJS-07KHB37Tr2gKcHBBRbjJi2VqBtSdj1bqtew2q8Lvs_aNk7DuuRRpG7yCWdeh3sgXVo9qQptSgWot1QF3U7XNm1LEc17VMrUCBUGTbVJ2vPfRKX37TLWq80qhcBYRF3keOFR-kVk4qyybgFafK0Z_"
    }
];

const Activities = () => {
    const { roomNumber } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form
    const [phone, setPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState('today'); // 'today' | 'tomorrow'
    const [selectedTime, setSelectedTime] = useState(null);

    // Generate time slots (10:00 AM to 10:00 PM)
    const timeSlots = [];
    for (let i = 10; i <= 22; i++) {
        timeSlots.push(`${i}:00`);
        if (i !== 22) timeSlots.push(`${i}:30`);
    }

    // Mock booked slots
    const isSlotBooked = (time) => {
        const booked = ['12:00', '14:30', '18:00', '20:30'];
        return booked.includes(time);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedTime) {
            alert(language === 'ar' ? 'يرجى اختيار الوقت' : 'Please select a time');
            setIsLoading(false);
            return;
        }

        const dateObj = new Date();
        if (selectedDate === 'tomorrow') {
            dateObj.setDate(dateObj.getDate() + 1);
        }

        const preferredTime = formatSupabaseDate(selectedTime, dateObj);

        try {
            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        service_type: 'activity',
                        room_number: roomNumber,
                        phone_number: phone,
                        language: language,
                        status: 'new',
                        activity_name: selectedActivity.name[language],
                        preferred_time: preferredTime,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            navigate(`/${roomNumber}/confirmation`);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to submit request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-8 animate-fade-in relative text-gray-900">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-heading text-2xl sm:text-3xl text-primary font-display">{t.activities.title}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACTIVITIES_DATA.map(activity => (
                    <div
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity)}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                    >
                        <div className="aspect-[16/10] overflow-hidden">
                            <img
                                alt={activity.name[language]}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src={activity.image}
                            />
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl mb-1 text-slate-800 font-heading">{activity.name[language]}</h3>
                            <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">location_on</span> {activity.location[language]}
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-primary">{activity.price[language]}</p>
                                <span className="text-xs uppercase tracking-wider text-slate-400">{t.activities.viewDetails}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Sheet */}
            {selectedActivity && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in" onClick={() => setSelectedActivity(null)}>
                    <div className="bg-white w-full rounded-t-3xl shadow-2xl transition-transform duration-500 ease-in-out border-t border-slate-200 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="max-w-2xl mx-auto flex flex-col">
                            <div className="flex justify-center p-3 cursor-pointer" onClick={() => setSelectedActivity(null)}>
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                            </div>

                            <div className="px-6 pb-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                                <h2 className="text-2xl text-center mb-2 font-heading">{t.activities.bookTitle} {selectedActivity.name[language]}</h2>
                                <p className="text-slate-500 text-center mb-8 text-sm">{t.activities.bookSubtitle}</p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">{t.common.phoneNumber}</label>
                                        <div className="relative">
                                            <span className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium material-icons-outlined`}>phone</span>
                                            <input
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg placeholder:text-slate-300 transition-all outline-none`}
                                                placeholder="+966 50..."
                                                type="tel"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">{t.activities.prefTime}</label>

                                        {/* Date Selection */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDate('today')}
                                                className={`py-3 rounded-xl text-sm font-semibold transition-all border ${selectedDate === 'today' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'}`}
                                            >
                                                {language === 'ar' ? 'اليوم' : 'Today'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDate('tomorrow')}
                                                className={`py-3 rounded-xl text-sm font-semibold transition-all border ${selectedDate === 'tomorrow' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'}`}
                                            >
                                                {language === 'ar' ? 'غداً' : 'Tomorrow'}
                                            </button>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {timeSlots.map(time => {
                                                const booked = isSlotBooked(time);
                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        disabled={booked}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2 rounded-lg text-xs font-medium transition-all ${booked
                                                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed decoration-slice'
                                                                : selectedTime === time
                                                                    ? 'bg-primary text-white shadow-md transform scale-105'
                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isLoading}
                                        className="w-full bg-primary hover:bg-opacity-90 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4"
                                        type="submit"
                                    >
                                        {isLoading ? t.common.confirming : t.common.confirmBooking}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activities;
