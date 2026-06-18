import React from 'react';
import { NewsGrid } from '../components/News/NewsGrid';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';
import { usePageTitle } from '../hooks/usePageTitle';

const NewsPage: React.FC = () => {
  usePageTitle('News & Insights');
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];
  
  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow bg-white min-h-screen">
      <div className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold text-black mb-6">{t.newsTitle}</h1>
          <p className="text-xl text-black font-normal max-w-2xl mx-auto">
            {t.newsSubtitle}
          </p>
        </div>
      </div>
      
      <section aria-labelledby="news-section-heading">
        <div className="sr-only">
          <h2 id="news-section-heading">{t.newsTitle}</h2>
        </div>
        <NewsGrid />
      </section>
      <AppointmentCTA />
    </main>
  );
};

export default NewsPage;