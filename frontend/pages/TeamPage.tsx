import React from 'react';
import { Team } from '../components/About/Team';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';

const TeamPage: React.FC = () => {
  usePageTitle('Our Team');
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];
  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow bg-white">
      <div className="pt-24 md:pt-32 pb-12 text-center bg-gray-50 border-b border-gray-100">
         <h1 className="text-4xl md:text-5xl font-serif font-bold text-black">{t.ourTeamTitle}</h1>
      </div>
      <Team hideHeader={true} />
      <AppointmentCTA />
    </main>
  );
};

export default TeamPage;
