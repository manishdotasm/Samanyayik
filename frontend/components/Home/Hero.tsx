


import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../UI/Button';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const { language } = useAccessibility();
  const t = TRANSLATIONS[language];

  // Helper to highlight words in green
  const renderTitle = () => {
    return (
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-black leading-tight mb-6">
        {language === 'en' ? (
          <>Injustice anywhere is a threat to justice <span className="text-secondary">everywhere</span>.</>
        ) : (
          <>{t.heroTitle}</>
        )}
      </h1>
    );
  };

  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row min-h-[80vh]">
          {/* Left Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 py-12 md:py-20 lg:px-12 z-10">
            <span className="text-secondary font-bold tracking-wider uppercase mb-4 text-sm md:text-base border-l-4 border-secondary pl-4">
              {t.heroContext}
            </span>
            
            {renderTitle()}
            
            <p className="text-lg md:text-xl text-black font-normal mb-10 max-w-lg leading-relaxed">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <Link to="/booking" className="w-full">
                <Button 
                  className="w-full justify-center py-4 text-lg"
                  onClick={() => document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t.bookAppointmentNow}
                </Button>
              </Link>
              
              <div className="flex gap-4 w-full">
                <Link to="/calculator/legal-fee" className="flex-1">
                  <Button variant="secondary" className="w-full justify-center px-2 text-sm md:text-base h-full">
                      {t.legalFeeCalc}
                  </Button>
                </Link>
                <Link to="/calculator/other" className="flex-1">
                  <Button variant="secondary" className="w-full justify-center px-2 text-sm md:text-base h-full">
                      {t.otherCalculators}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full bg-gray-100">
            <img 
              src="/assets/hero-section.jpg" 
              alt="A bronze statue of Lady Justice holding balanced scales in her left hand and a sword in her right, wearing a blindfold to symbolize impartiality, standing against a neutral, textured background." 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Contact Overlay Button */}
            <div className="absolute bottom-8 right-8">
              <a href="tel:+9779861292120">
                <div className="bg-white/95 backdrop-blur-md p-6 shadow-2xl rounded-lg border-l-4 border-secondary max-w-xs cursor-pointer hover:scale-105 transition-transform">
                    <p className="text-sm uppercase tracking-wide text-black font-bold mb-1">{t.needUrgentHelp}</p>
                    <div className="flex items-center text-secondary">
                        <Phone className="w-6 h-6 mr-3" />
                        <span className="text-xl font-bold">{t.contactUs}</span>
                    </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};