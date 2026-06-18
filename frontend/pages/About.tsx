

import React from 'react';
import { Scale } from 'lucide-react';
import { ABOUT_CONTENT, ABOUT_CONTENT_NP, SIMPLIFIED_ABOUT_CONTENT, SIMPLIFIED_ABOUT_CONTENT_NP } from '../constants';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Mission } from '../components/About/Mission';
import { Philosophy } from '../components/About/Philosophy';
import { ImpactStory } from '../components/About/ImpactStory';
import { Achievements } from '../components/Home/Achievements';
import { PastProjects } from '../components/Home/PastProjects';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';

const About: React.FC = () => {
  usePageTitle('About Us');
  const { language, simplifiedMode } = useAccessibility();
  const content = simplifiedMode
    ? (language === 'np' ? SIMPLIFIED_ABOUT_CONTENT_NP : SIMPLIFIED_ABOUT_CONTENT)
    : (language === 'np' ? ABOUT_CONTENT_NP : ABOUT_CONTENT);

  return (
    <div className="bg-white">
      <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow">
        {/* Header Section - Who We Are */}
        <section className="py-20 md:py-28 px-4 text-center bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="mb-8 animate-fade-in-up">
                  <img 
                    src="/assets/FINAL LOGO.png" 
                    alt="A circular logo with a white background and a black border. Inside, at the top, the word 'SAMANYAYIK' is written in bold uppercase black letters. In the center, there is a golden balance scale with a glowing light at the top, symbolizing justice. Below the scale, there is an open book with a black ink pen tip emerging from its center, representing legal research and writing. Underneath the book, a golden plaque displays the word 'समन्यायिक' in Nepali script. Surrounding the central elements, two green laurel branches curve along the sides. Around the bottom edge, the words 'LEGAL SERVICE AND RESEARCH CENTER' are written in bold uppercase black letters." 
                    className="w-48 h-auto object-contain mx-auto"
                  />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8">
                  {content.whoWeAre.title}
              </h1>

              <p className="text-xl md:text-2xl text-black font-sans font-normal leading-relaxed text-justify md:text-center">
                {content.whoWeAre.text}
              </p>
          </div>
        </section>

        <Mission />
        <Philosophy />
        <ImpactStory />
        <Achievements />
        <PastProjects />
        <AppointmentCTA />
      </main>
    </div>
  );
};

export default About;
