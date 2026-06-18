
import React from 'react';
import { PublicationList } from '../components/Research/PublicationList';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';
import { BookOpen } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const ResearchPage: React.FC = () => {
  usePageTitle('Research & Publications');
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];
  
  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow bg-white">
      <div className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <BookOpen className="w-16 h-16 text-secondary mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">{t.researchTitle}</h1>
          <p className="text-xl text-black font-normal max-w-2xl">
            {t.researchSubtitle}
          </p>
        </div>
      </div>
      
      <section aria-labelledby="research-section-heading">
        <div className="sr-only">
          <h2 id="research-section-heading">{t.researchTitle}</h2>
        </div>
        <PublicationList />
      </section>
      <AppointmentCTA />
    </main>
  );
};

export default ResearchPage;
