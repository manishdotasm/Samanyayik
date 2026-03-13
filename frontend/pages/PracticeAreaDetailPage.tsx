import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES, SERVICE_CATEGORIES_NP, TRANSLATIONS } from '../constants';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { CheckCircle2 } from 'lucide-react';

const PracticeAreaDetailPage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const { language } = useAccessibility();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();

    const categories = language === 'np' ? SERVICE_CATEGORIES_NP : SERVICE_CATEGORIES;
    
    let foundService = null;
    for (const cat of categories) {
        const svc = cat.subServices.find(s => s.id === serviceId);
        if (svc) {
            foundService = svc;
            break;
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [serviceId]);

    if (!foundService) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl font-bold text-gray-800">Service not found</p>
            </div>
        );
    }

    // Matching Modal Content Structure from PracticeAreasPage.tsx
    return (
         <main id="main-content" tabIndex={-1} className="flex-grow bg-white min-h-screen py-12 px-4 md:px-8">
             <div className="max-w-4xl mx-auto">
                <div className="prose max-w-none text-black font-sans">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-6 leading-tight">
                        {foundService.title}
                    </h2>

                    <div className="flex items-center gap-2 mb-8 text-secondary font-bold text-sm uppercase tracking-wide border-b border-gray-100 pb-4">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{language === 'np' ? "विस्तृत जानकारी" : "Detailed Overview"}</span>
                    </div>
                    
                    <div 
                        className="text-lg leading-relaxed space-y-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li>strong]:text-black"
                        dangerouslySetInnerHTML={{ __html: foundService.fullContent }} 
                    />

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <button 
                            onClick={() => navigate('/booking')}
                            className="text-secondary font-bold hover:underline"
                        >
                            {language === 'np' 
                              ? "यसमा सहयोग चाहिन्छ? नियुक्ति बुक गर्नुहोस्।" 
                              : "Need assistance with this? Book an appointment."}
                        </button>
                    </div>
                </div>
             </div>
        </main>
    );
};

export default PracticeAreaDetailPage;
