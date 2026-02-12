import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Chatbot from '../components/Chatbot';

const ServiceCard = ({ icon, title, to }) => (
    <Link
        to={to}
        className="luxury-card border border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white shadow-sm cursor-pointer group hover:shadow-md transition-all"
    >
        <div className="mb-4 bg-primary/5 p-3 rounded-full group-hover:bg-primary/10 transition-colors">
            <span className="material-icons-outlined text-primary text-3xl">{icon}</span>
        </div>
        <h3 className="text-primary font-semibold text-sm md:text-base uppercase tracking-wider">{title}</h3>
    </Link>
);

const Welcome = () => {
    const { roomNumber } = useParams();
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="flex flex-col h-full animate-fade-in text-gray-900">
            <div className="text-center mb-12">
                <h1 className="font-heading text-3xl md:text-5xl mb-3 text-primary">
                    {t.common.welcome}
                </h1>
                <p className="text-gray-500 text-lg font-light">
                    {t.common.room} <span className="font-medium text-primary">{roomNumber}</span>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                <ServiceCard icon="directions_car" title={t.welcome.cars} to="cars" />
                <ServiceCard icon="card_giftcard" title={t.welcome.gifts} to="gifts" />
                <ServiceCard icon="explore" title={t.welcome.activities} to="activities" />
                <ServiceCard icon="restaurant" title={t.welcome.restaurants} to="restaurants" />
            </div>

            <div className="mt-auto pt-8 pb-10">
                <p className="text-center mt-6 text-xs text-gray-400 uppercase tracking-widest">
                    {t.welcome.footer}
                </p>
            </div>

            <Chatbot />
        </div>
    );
};

export default Welcome;
