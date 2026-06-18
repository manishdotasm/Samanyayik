import React from 'react';
import { NoticeBoard } from '../components/Notices/NoticeBoard';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';
import { BellRing } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const NoticesPage: React.FC = () => {
  usePageTitle('Notice Board');
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];
  
  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow bg-white">
      <div className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <BellRing className="w-16 h-16 text-secondary mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">{t.noticesTitle}</h1>
          <p className="text-xl text-black font-normal max-w-2xl">
            {t.noticesSubtitle}
          </p>
        </div>
      </div>
      
      <section aria-labelledby="notices-section-heading">
        <div className="sr-only">
          <h2 id="notices-section-heading">{t.noticesTitle}</h2>
        </div>
        <NoticeBoard />
      </section>
      <AppointmentCTA />
    </main>
  );
};

export default NoticesPage;