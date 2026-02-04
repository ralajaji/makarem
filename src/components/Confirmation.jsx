import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Confirmation = () => {
    const { roomNumber } = useParams();
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6 text-gray-900">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-outlined text-green-600 text-4xl">check_circle</span>
            </div>

            <h2 className="font-heading text-2xl font-bold mb-2">{t.common.requestReceived}</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
                {t.common.conciergeContact}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg w-full max-w-xs mb-8">
                <p className="text-sm text-gray-600">{t.common.room}</p>
                <p className="font-bold text-lg mb-2">{roomNumber}</p>
            </div>

            <Link
                to={`/${roomNumber}`}
                className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
                <span className={`material-icons-outlined text-sm ${language === 'ar' && 'transform rotate-180'}`}>arrow_back</span>
                {t.common.backMessages}
            </Link>
        </div>
    );
};

export default Confirmation;
