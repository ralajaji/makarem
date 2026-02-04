import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/makarem_logo.png';

const MainLayout = () => {
    const { roomNumber } = useParams();
    const { language, toggleLanguage } = useLanguage();

    useEffect(() => {
        // Force light mode
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        // Set direction based on language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        // Set font based on language
        if (language === 'ar') {
            document.body.style.fontFamily = "'Alexandria', sans-serif";
        } else {
            document.body.style.fontFamily = "'Alexandria', sans-serif"; // Using Alexandria for English body as well per prompt, or defaulting
        }
    }, [language]);

    return (
        <div className="min-h-screen bg-white font-body text-gray-900 flex flex-col">
            <header className="p-6 flex justify-between items-center w-full max-w-4xl mx-auto">
                <div className="w-10"></div>
                <div className="flex-grow flex justify-center">
                    <img
                        alt="Makarem Logo"
                        className="h-12 md:h-14 object-contain"
                        src={logo}
                    />
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium tracking-wide">
                    <button
                        onClick={() => language !== 'en' && toggleLanguage()}
                        className={`transition-colors ${language === 'en' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'}`}
                    >
                        EN
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={() => language !== 'ar' && toggleLanguage()}
                        className={`transition-colors ${language === 'ar' ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'}`}
                    >
                        العربية
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col px-6 py-8 w-full max-w-4xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
