import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const RESTAURANTS_DATA = [
    {
        id: 1,
        name: { en: "Al-Saray", ar: "السرايا" },
        category: "Arabic",
        tags: { en: "Arabic Fine Dining", ar: "مأكولات عربية فاخرة" },
        rating: "4.9",
        time: { en: "25-40 min", ar: "25-40 دقيقة" },
        description: { en: "Authentic Levantine flavors with a modern twist, specializing in traditional grills and mezzes.", ar: "نكهات شامية أصيلة بلمسة عصرية، متخصص في المشاوي والمقبلات التقليدية." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXO3sHN9nysyfZFxXnbJ4fLibK1ZfZu10fbAWYuT4ws3jqSkt8iIiWJ99Q-1HlpD9N4NRZqyhpiR2QY0_ldFpOPrlniNxfxtuaRvMAlF_3xIoNNsCwt8b1WN00Mg_YvxDjpqicisIMk0z9223cqs_wHLgeljkXcTnKR1IMm23K7mv_OWi_EfJPrx6Hl_eZLv0AIVMr9lK0OuoLgmKP7SETThErkDLKP8sCsulSlKCzYDuaSNwXK4ragCbxCgYbBxoED_dL5fPyBNNS"
    },
    {
        id: 2,
        name: { en: "Lumière", ar: "لوميير" },
        category: "French",
        tags: { en: "French Brasserie", ar: "مخبز فرنسي" },
        rating: "4.8",
        time: { en: "30-50 min", ar: "30-50 دقيقة" },
        description: { en: "Classic French brasserie menu featuring hand-selected seasonal ingredients and pastries.", ar: "قائمة طعام فرنسية كلاسيكية تضم مكونات موسمية ومعجنات مختارة بعناية." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKYLlq_2glK3Jzp2TNeikIdh4o2w5M_OgnGwU_4oLtfPoQXFN8vptkpsLLD5pWITcn3Xstni32SyPFdUKqb4Up1NpHk-sxQLGtsQU9e6RTGH-fEYh7uRE1QVmZ7pdiSREtjS3bHAXo0m1JaLzBaJaZLWEWkVw_tPXKxLdoR6dEk4mQ6BEzho03YjAYF-FmiCfyziUzv80jHRy4QmbSx7gMuL07QO6hdwB6bX0phzd7V-n1lGF_4lwu2nf0MntxS-bXrJ7dISQYQHgF"
    },
    {
        id: 3,
        name: { en: "The Silk Road", ar: "طريق الحرير" },
        category: "Asian",
        tags: { en: "Asian Fusion", ar: "آسيوي" },
        rating: "4.7",
        time: { en: "20-35 min", ar: "20-35 دقيقة" },
        description: { en: "A journey across Asian cuisines, from hand-pulled noodles to exquisite sushi platters.", ar: "رحلة عبر المأكولات الآسيوية، من النودلز المحضرة يدوياً إلى أطباق السوشي الفاخرة." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYZTonDZmnpbtGSqcT34TsFSG7NwtwD6oyzmwjQHX3zbTRv--4cWYFGuFpoVRmBtTAK418AJYIhb4hPO9IK_0mGvhxx4gYk0ylXOrm4SbrfOv27_VizwZmJ5ZuGLLpfh_jqxBrDvFqrWPiaOP9wndi6hydnoXOGnNNi1FCRUIdkZpszhIV7-dzTp5cLTmpyagiYHLjM_B8_W2dvxHZwOjt8-nJwPjmeaiBQfYX1R22MiJBrQCOGn4LuV3SoHrbj_uK550L2nxISsaP"
    },
    {
        id: 4,
        name: { en: "Gusto Italiano", ar: "غوستو إيتاليانو" },
        category: "Italian",
        tags: { en: "Pizzeria & Pasta", ar: "بيتزا وباستا" },
        rating: "4.9",
        time: { en: "15-30 min", ar: "15-30 دقيقة" },
        description: { en: "Wood-fired pizzas and homemade pasta prepared with imported Italian ingredients.", ar: "بيتزا على الحطب وباستا محلية الصنع محضرة بمكونات إيطالية مستوردة." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDa-S8GAeGwKtmfJ10C8hnMMcKIkFh2rbcwWFah4Ix8Wr9q8zCSkq61YrQiEkoQnjMi3j7gnfODZ7z74uP_GGQAE6pMrxDQYmrSUDptVap_a402i8KV609smP-uCJ3yaC3DjXLZiFe_bz8HzVhi-5Ul4cNPiRTsvtIgqwYUPv8sxz8dfbYQ7o2EqvScBqa01EdckvQuK6Hfs2CMY5LbiatnrnCx48GSXb8alCfiOPOKibuQR2NQnOPbao6AcxRkZTihASsFrJn6LBHq"
    },
    {
        id: 5,
        name: { en: "Coastal Harvest", ar: "حصاد الساحل" },
        category: "Seafood",
        tags: { en: "Fresh Seafood", ar: "مأكولات بحرية طازجة" },
        rating: "4.6",
        time: { en: "40-60 min", ar: "40-60 دقيقة" },
        description: { en: "The freshest catch of the day, grilled to perfection and served with seasonal vegetables.", ar: "أفضل صيد لليوم، مشوي بإتقان ويقدم مع الخضروات الموسمية." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIWMXx-OgnDbXNQkm4Hg34IaT17Zy8iOg5AgtgxmdJnasYbH9AoDuGkVKJ4VyX5IOSUVgLHpCVcCii2v5hKJSVTlsJ-QX0h9e0fOVPwinlUQsDueYjksnbcqJqmEZ-96w8hatN2AkNZGhI8CGBjXcUK_BwDIBgmJbvthuQ_eiDWcOOr28VbcTcVUCT8A1fe_tedHyu84zwLFii7fznJChkpegT_VRrmRPD6lKYdE4dZNYlBRD-pSkeLjEEUWzX5eDdsTe4VccjwlCy"
    },
    {
        id: 6,
        name: { en: "The Green Leaf", ar: "الورقة الخضراء" },
        category: "Organic",
        tags: { en: "Organic & Vegan", ar: "عضوي ونباتي" },
        rating: "4.8",
        time: { en: "20-30 min", ar: "20-30 دقيقة" },
        description: { en: "Healthy, wholesome bowls and organic juices designed for wellness-focused guests.", ar: "أطباق صحية ومغذية وعصائر عضوية مصممة للضيوف المهتمين بالصحة." },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV2rhBiriy-ZpN98xcdSMTxO6YihET7Ug0DMg0C2hCHgxpjVzL4djeVQ8VqZMTOyiqV2CfuAf3DMOq2zW2lJmWLUnAqvUTjbcdEJj6pmqHGwfyGZsanPi5hzhw5J4_MuamaD29IjlVF98hHrEXFwVrRSbHkb7TOcfVlgt_El_0AEe8Lf9-pq1mTvvOQHrIjxVNT0FghCTRXFR8WoBRFQWNUxVRonIxu44Pz7U-0JNrYp9tJFUOUVpIUSb4U6qwEA1zbp5MNP9qYB5e"
    }
];

const CATEGORIES = [
    { id: "All", en: "All", ar: "الكل" },
    { id: "Arabic", en: "Arabic", ar: "عربي" },
    { id: "Italian", en: "Italian", ar: "إيطالي" },
    { id: "Seafood", en: "Seafood", ar: "مأكولات بحرية" },
    { id: "French", en: "French", ar: "فرنسي" },
    { id: "Asian", en: "Asian", ar: "آسيوي" },
    { id: "Organic", en: "Organic", ar: "عضوي" }
];

const Restaurants = () => {
    const { roomNumber } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const [filter, setFilter] = useState("All");
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');

    const filteredRestaurants = filter === "All"
        ? RESTAURANTS_DATA
        : RESTAURANTS_DATA.filter(r => r.category === filter);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        service_type: 'restaurant',
                        room_number: roomNumber,
                        phone_number: phone,
                        language: language,
                        status: 'new',
                        restaurant_name: selectedRestaurant.name[language],
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            navigate(`/${roomNumber}/confirmation`);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-10 animate-fade-in relative text-gray-900">
            <div className="mb-8">
                <h1 className="font-heading text-4xl font-bold tracking-tight mb-3 text-primary">{t.restaurants.title}</h1>
                <p className="text-gray-500 max-w-2xl text-lg">
                    {t.restaurants.subtitle}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === cat.id ? 'bg-primary text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {cat[language]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredRestaurants.map(restaurant => (
                    <div
                        key={restaurant.id}
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img
                                alt={restaurant.name[language]}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={restaurant.image}
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <span className="material-icons-outlined text-amber-500 text-sm">star</span>
                                <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-gray-900">{restaurant.name[language]}</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded uppercase tracking-wider text-gray-600">{
                                    CATEGORIES.find(c => c.id === restaurant.category)?.[language] || restaurant.category
                                }</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">{restaurant.description[language]}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                    <span className="material-icons-outlined text-lg">schedule</span>
                                    <span>{restaurant.time[language]}</span>
                                </div>
                                <span className="flex items-center gap-2 text-primary font-semibold text-sm">
                                    {t.restaurants.orderNow} <span className={`material-icons-outlined text-sm ${language === 'ar' && 'transform rotate-180'}`}>arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Sheet */}
            {selectedRestaurant && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in" onClick={() => setSelectedRestaurant(null)}>
                    <div className="bg-white w-full max-w-2xl mx-auto rounded-t-[32px] shadow-2xl p-8 border-t border-gray-100 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 cursor-pointer" onClick={() => setSelectedRestaurant(null)}></div>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons-outlined text-primary text-3xl">restaurant</span>
                            </div>
                            <h2 className="font-heading text-2xl font-bold mb-2 text-primary">{t.restaurants.connectTitle} {selectedRestaurant.name[language]}</h2>
                            <p className="text-gray-500">{selectedRestaurant.tags[language]} • {t.restaurants.connectSubtitle}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.common.enterPhone}</label>
                                <div className="relative">
                                    <span className={`material-icons-outlined absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}>call</span>
                                    <input
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-lg text-gray-900`}
                                        placeholder="+966 5X XXX XXXX"
                                        type="tel"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                type="submit"
                            >
                                {isLoading ? t.common.requestingCall : t.common.callMe}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRestaurant(null)}
                                className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                            >
                                {t.common.cancel}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurants;
