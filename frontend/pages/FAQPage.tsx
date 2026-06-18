import React from 'react';
import { FAQList } from '../components/FAQ/FAQList';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';
import { HelpCircle } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const FAQPage: React.FC = () => {
  usePageTitle('Frequently Asked Questions');
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];

  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow bg-white min-h-screen">
      <div className="bg-gray-50 py-16 border-b border-gray-200 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <HelpCircle className="w-16 h-16 text-secondary mb-6" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">{t.faqTitle}</h1>
          <p className="text-xl text-black font-normal max-w-2xl">
            {t.faqSubtitle}
          </p>
        </div>
      </div>
      
      <section className="py-12" aria-labelledby="faq-list-heading">
        <div className="sr-only">
          <h2 id="faq-list-heading">{t.faqTitle}</h2>
        </div>
        <FAQList />
      </section>

      <AppointmentCTA />
    </main>
  );
};

export default FAQPage;