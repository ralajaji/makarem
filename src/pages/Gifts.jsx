import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { formatSupabaseDate } from '../lib/utils';

const GIFTS_DATA = [
    {
        id: 1,
        name: { en: "Purple Elegance Arrangement", ar: "تنسيق الأناقة البنفسجية" },
        price: "450 SAR",
        category: "Signature Roses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFt3Qj4vR5wc2hwJLarf_B0AlLUzAFiPhGZBew3cp4dqx7msmDxGqB5oc2ZciaLo8cb_qeSvblHP74YnOEY2SBaukzfx1TSKZALoj93AsPT7WGtTF3tIgbfJ89KS_Z-lJrYqrIwMLyIjsUZl-zg7LkJ1H02Khk480o52OAEjipkYEVTIfBf77T4YUUBHpiTqNzx4wnHPmCKuucdvkIJy6gWZXz-tKGS_wO_j6uJRMKBtNHoTgfm8EwLF_vBt9b_s4lOGtuY4tlt7WY",
        badge: { en: "Signature", ar: "مميز" }
    },
    {
        id: 2,
        name: { en: "Majestic White Lilies", ar: "الزنابق البيضاء الملكية" },
        price: "380 SAR",
        category: "Signature Roses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNXK0zh0uXhcnZu7ErfyBuri5VNKXzAnF1kXeF3W0U2Rc2KxP2DyddqEbAnbW70igHwIgudasiug1TqYV_9ILFXoeWXw0E9ctY2LJ_THBnMc_-eGJgkHyrjIHQ9ZX7C4v3k7czYUuMhwW4PeL18BBhGnibNt3BIyOsudDqes8Ri3t8WQG7oHn2nlDF4OEWx_xY3W_MG6YMe0f3nQDwNOG-hfNeFQbVqIvKwBoekQKm92-lQiNAzZgTDx17tQBPsi9Qx6HdQGWqx49V",
        badge: null
    },
    {
        id: 3,
        name: { en: "Royal Velvet Rose Box", ar: "صندوق الورد المخملي الملكي" },
        price: "620 SAR",
        category: "Premium Hampers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChBwJI3b6q2f5sM-uBlGmRXuzn-_CKSy1g2xnhQLeyoRVIBoxSbqdv2Ya1y0RLciErXqwIv1SzOm2ZkhAaqKqGmNuA-Rb6qp-njPlZvfeld8eSxiK-x-oXO63x-Xng1g94TIgpJcB77PSxOwVtVkBU6DiEDJRiFm2X_0oGwAy42akmBaYlT2zITXtIvNKscN2MKE3wgey9UIxftESJW8VB2pazcY2-DQVUjvD2RJxSGd1kDPj0Jfbx0wiToqNoZ9aBrGJO62r5Jtk0",
        badge: { en: "Luxury", ar: "فاخر" }
    },
    {
        id: 4,
        name: { en: "Spring Meadow Bouquet", ar: "باقة ربيع المروج" },
        price: "290 SAR",
        category: "Seasonal Specials",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCtKCn3z4QRPObLKwMxCYTEfTiI_u60STmrevj4Do4WpUpJaS4l_vPS6sI_nGo2SjgZ2FYRDqZ1jG1x1iLNzkDEgofiJ96zCEeriorjG1RwAdy1w-9toetuaFDHy-y9xoOGDdVGhN-MQQfOSgbiwgObBtDsRcM7P__Q53S7CdZIpHeeoP3N18DRg_vaa0U76HsgMPCIXrmT_aDKrU2gtq3U2R-lrzkRbdtgWCvASTygM8cEu-q8mmEuP3nHiwSc2iHh6f4hqBULgWy",
        badge: null
    },
    {
        id: 5,
        name: { en: "Pastel Dreams Basket", ar: "سلة أحلام الباستيل" },
        price: "410 SAR",
        category: "Seasonal Specials",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIPDTcXrqH6xSOb-vesgwIfsbac9QmcKz-FmsAObtrq766YhA1Gxbb1hhPlq4wna8Ux2TpZuk55RQWB5gcYd9k_GWQVsrUJaT7hORAnOjT3Ugv-1anLJlXTpkR6iOL4KGzO-p_k9-sdJ5VTn_Fvg4dDoCjGuN497MmlMQ-P0D33huVpIV6_JvlvvxsbH26H3IX-aj3xlTYYEo9Z1WMshyKI2e2tGY8qic7ESocziIdu1_QOS2fR2iKkxunTdB3MPxHOvLg3sddShvj",
        badge: null
    },
    {
        id: 6,
        name: { en: "Crimson Passion Dozen", ar: "درزن الشغف القرمزي" },
        price: "550 SAR",
        category: "Signature Roses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDo0GsLFWbspFJVSehqLiRtaUTJkptrWlUnmajVKdfG0U2EikqnbywfI4JWJc9z-GyvAAdXvKgFpePW0ed5fkKRCq56cPH_H-falgHLllwwB4yqS4wcTrFGxnynMzcOFoZnAAcd0e50RTfI0fEmt8ILk6aIt5waRzs21bfXFSXhNv1b2St_nfiOMvKUN9nYClwdiUvxPl4DeHgd7L8lnfCjdCaMTaFxg8vqIyTJtjVKpLxlBKkVgvUADsLL1xLxPIM_ZuzV1znwsiWy",
        badge: null
    },
    {
        id: 7,
        name: { en: "Imperial Phalaenopsis", ar: "الأوركيد الإمبراطوري" },
        price: "780 SAR",
        category: "Premium Hampers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCzRmnpbY0MT1CPwdxELOJb_04LEDnel-vKPmuengI9hSJl96oMmJ1P_Yty-1c2lScZnJ_arZBnl6AfY5zeWsP79r3QO4oUYyzgKpD56bMyVxgKT_Xsz3Ixt0NXP9yDmxmWLkM5lLK9PQXPy6-UGUO1zjragjrkX5OK99Ft44tl_ZMLFP0tEL_FanyefCToNog0EygukYsfl6_tQY70YVEHEj1GVLZZkMjZM7vqihRKbmVLP-8tPtTaKrISPPWsMpSJLNAkK2HSLms",
        badge: null
    },
    {
        id: 8,
        name: { en: "Artisan Chocolate Truffles", ar: "ترافل الشوكولاتة الفاخر" },
        price: "185 SAR",
        category: "Sweet Delights",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByBAqL-tpFt4Xjijcz9rcGWoeTEybl9jc-nKCpAaAOo3bXCZ08F6hYVtz6HTMb--b-CHLzMRnkSqN3m5nM0kl2pZ2PSGiwpoMuYiqAYZeGudHW2YmxeMk6uuR4mWwDlNvPE_ZyHSo2Kf-a_WK98F-0SgJ0CRtnghsfQQ_Wn0klvnG3n9GBW33N3XyMCbq_XCsjjlXu2pYzCmmg23uDKbgcL05Ko0QjWWVVb-c1Vz4kD8u335DIruOCAHfTgRds6dIMrg_W2qLoJsHw",
        badge: null
    }
];

const CATEGORIES = [
    { id: "All", en: "All", ar: "الكل" },
    { id: "Signature Roses", en: "Signature Roses", ar: "الورود المميزة" },
    { id: "Sweet Delights", en: "Sweet Delights", ar: "الحلويات" },
    { id: "Premium Hampers", en: "Premium Hampers", ar: "الهدايا الفاخرة" },
    { id: "Seasonal Specials", en: "Seasonal Specials", ar: "عروض الموسم" }
];

const Gifts = () => {
    const { roomNumber } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    const [filter, setFilter] = useState("All");
    const [selectedGift, setSelectedGift] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const filteredGifts = filter === "All"
        ? GIFTS_DATA
        : GIFTS_DATA.filter(g => g.category === filter);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const deliveryDate = formatSupabaseDate(time, date);

        try {
            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        service_type: 'gift',
                        room_number: roomNumber,
                        phone_number: phone,
                        language: language,
                        status: 'new',
                        gift_name: selectedGift.name[language], // Saving translated name or strictly EN? Saving selected language for better admin context
                        delivery_date: deliveryDate,
                        card_message: message,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            navigate(`/${roomNumber}/confirmation`);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(language === 'ar' ? 'فشل في إرسال الطلب' : 'Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-10 animate-fade-in relative text-gray-900">
            <div className="text-center mb-8">
                <h1 className="font-heading text-4xl font-bold text-primary mb-2">{t.gifts.title}</h1>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    {t.gifts.subtitle}
                </p>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        className={`px-6 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {cat[language]}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGifts.map(gift => (
                    <div
                        key={gift.id}
                        onClick={() => setSelectedGift(gift)}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                            <img
                                alt={gift.name[language]}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                src={gift.image}
                            />
                            {gift.badge && (
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-primary">
                                    {gift.badge[language]}
                                </div>
                            )}
                        </div>
                        <h3 className="font-medium text-xs md:text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2 text-gray-900">{gift.name[language]}</h3>
                        <p className="text-primary font-semibold text-xs">{gift.price}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Sheet */}
            {selectedGift && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in" onClick={() => setSelectedGift(null)}>
                    <div className="bg-white w-full max-w-lg rounded-t-[32px] shadow-2xl animate-slide-up transform transition-transform duration-300" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4 mb-6 cursor-pointer" onClick={() => setSelectedGift(null)}></div>

                        <div className="px-8 pb-10 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-heading text-xl text-primary mb-1">{selectedGift.name[language]}</h2>
                                    <p className="text-xs text-gray-500">{selectedGift.price}</p>
                                </div>
                                <button onClick={() => setSelectedGift(null)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                                    <span className="material-icons-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.common.phoneNumber}</label>
                                    <div className="relative">
                                        <span className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-sm`}>phone</span>
                                        <input
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900`}
                                            placeholder="+966 50..."
                                            type="tel"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.gifts.date}</label>
                                        <input
                                            required
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.gifts.time}</label>
                                        <input
                                            required
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.gifts.message} ({t.common.optional})</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 h-24 resize-none"
                                        placeholder="..."
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    type="submit"
                                >
                                    <span>{isLoading ? t.gifts.ordering : t.gifts.placeOrder}</span>
                                    {!isLoading && <span className="material-icons-outlined text-lg">check</span>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gifts;
