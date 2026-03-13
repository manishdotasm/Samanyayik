import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { TRANSLATIONS, TEAM_MEMBERS, TEAM_MEMBERS_NP } from '../../constants';
// import { TeamMember } from '../../types';
import { Link } from 'react-router-dom';

export const Team: React.FC = () => {
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];
  const members = language === 'np' ? TEAM_MEMBERS_NP : TEAM_MEMBERS;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-16 text-black">{t.ourTeamTitle}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <Link 
              key={index} 
              to={`/team/${index}`}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-secondary transition-colors duration-300">
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
              </div>
              
              <h3 className="text-xl font-bold text-black mb-1 text-center group-hover:text-secondary transition-colors">{member.name}</h3>
              <p className="text-sm font-bold text-gray-600 text-center uppercase tracking-wide">{member.workingArea}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
