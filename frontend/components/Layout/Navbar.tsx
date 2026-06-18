

import React, { useState } from 'react';
import { Menu, X, Phone, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../UI/Button';

export const Navbar: React.FC = () => {
  const { language, setLanguage } = useAccessibility();
  const t = TRANSLATIONS[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const location = useLocation();

  const toggleResources = () => setIsResourcesOpen(!isResourcesOpen);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-primary border-b border-gray-100 sticky top-0 z-40" aria-label="Primary Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
               <img 
                 src="/assets/FINAL LOGO.png" 
                 alt="A circular logo with a white background and a black border. Inside, at the top, the word 'SAMANYAYIK' is written in bold uppercase black letters. In the center, there is a golden balance scale with a glowing light at the top, symbolizing justice. Below the scale, there is an open book with a black ink pen tip emerging from its center, representing legal research and writing. Underneath the book, a golden plaque displays the word 'समन्यायिक' in Nepali script. Surrounding the central elements, two green laurel branches curve along the sides. Around the bottom edge, the words 'LEGAL SERVICE AND RESEARCH CENTER' are written in bold uppercase black letters." 
                 className="h-16 w-auto object-contain group-hover:scale-105 transition-transform"
               />
               <span className="text-3xl font-serif font-bold text-black tracking-tight">{t.firmName}</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 ml-8">
            
            {/* Main Links */}
            <div className="flex items-center gap-4 xl:gap-6 text-sm xl:text-base font-medium">
                <Link to="/" className="text-gray-900 hover:text-secondary transition-colors whitespace-nowrap">{t.navHome}</Link>
                
                {/* About Dropdown */}
                <div
                   className="relative group"
                   onMouseEnter={() => setIsAboutOpen(true)}
                   onMouseLeave={() => setIsAboutOpen(false)}
                   onFocus={() => setIsAboutOpen(true)}
                   onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsAboutOpen(false); }}
                   onKeyDown={(e) => { if (e.key === 'Escape') setIsAboutOpen(false); }}
                >
                   <button 
                      className="flex items-center text-gray-900 hover:text-secondary focus:text-secondary focus:outline-none whitespace-nowrap focus:ring-2 focus:ring-secondary rounded px-1"
                      aria-haspopup="true"
                      aria-expanded={isAboutOpen}
                      onClick={() => setIsAboutOpen((o) => !o)}
                   >
                      {t.navAbout}
                      <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                   </button>
                   <div className={`absolute top-full left-0 w-56 bg-white shadow-xl rounded-lg border border-gray-100 group-hover:block group-focus-within:block pt-4 ${isAboutOpen ? 'block' : 'hidden'}`}>
                      <div className="py-2 flex flex-col bg-white rounded-lg">
                        <Link to="/about" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsAboutOpen(false)}>{t.navProfile}</Link>
                        <Link to="/team" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsAboutOpen(false)}>{t.navTeam}</Link>
                      </div>
                   </div>
                </div>
                <Link to="/practice-areas" className="text-gray-900 hover:text-secondary transition-colors whitespace-nowrap">{t.navPractice}</Link>
                
                {/* Resources Dropdown */}
                <div
                   className="relative group"
                   onMouseEnter={() => setIsResourcesOpen(true)}
                   onMouseLeave={() => setIsResourcesOpen(false)}
                   onFocus={() => setIsResourcesOpen(true)}
                   onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsResourcesOpen(false); }}
                   onKeyDown={(e) => { if (e.key === 'Escape') setIsResourcesOpen(false); }}
                >
                   <button 
                      className="flex items-center text-gray-900 hover:text-secondary focus:text-secondary focus:outline-none whitespace-nowrap focus:ring-2 focus:ring-secondary rounded px-1"
                      aria-haspopup="true"
                      aria-expanded={isResourcesOpen}
                      onClick={() => setIsResourcesOpen((o) => !o)}
                   >
                      {t.resources}
                      <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                   </button>
                   <div className={`absolute top-full left-0 w-56 bg-white shadow-xl rounded-lg border border-gray-100 group-hover:block group-focus-within:block pt-4 ${isResourcesOpen ? 'block' : 'hidden'}`}>
                      <div className="py-2 flex flex-col bg-white rounded-lg">
                        <Link to="/news" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsResourcesOpen(false)}>{t.navNews}</Link>
                        <Link to="/notices" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsResourcesOpen(false)}>{t.navNotices}</Link>
                        <Link to="/research" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsResourcesOpen(false)}>{t.navResearch}</Link>
                        <Link to="/faq" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsResourcesOpen(false)}>{t.navFAQ}</Link>
                      </div>
                   </div>
                </div>

                <Link to="/contact" className="text-gray-900 hover:text-secondary transition-colors whitespace-nowrap">{t.navContact}</Link>
            </div>    
                {/* Language Switcher (Desktop) */}
                <button 
                    onClick={() => setLanguage(language === 'en' ? 'np' : 'en')}
                    className="flex items-center justify-center min-h-[44px] min-w-[44px] px-3 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 focus:bg-gray-100 transition-colors text-sm font-bold ml-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                    aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
                >
                    {language === 'en' ? 'NP' : 'EN'}
                </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>
            
            {/* Action Items */}
            <div className="flex items-center gap-4">
                <a href="tel:+9779861292120" className="hidden xl:flex items-center gap-2 text-gray-900 hover:text-secondary transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-medium font-serif">+977 9861292120</span>
                </a>

                {/* Calculators Dropdown */}
                <div
                   className="relative group hidden md:block"
                   onMouseEnter={() => setIsCalcOpen(true)}
                   onMouseLeave={() => setIsCalcOpen(false)}
                   onFocus={() => setIsCalcOpen(true)}
                   onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsCalcOpen(false); }}
                   onKeyDown={(e) => { if (e.key === 'Escape') setIsCalcOpen(false); }}
                >
                   <div className="flex items-center">
                      <Button variant="primary" size="sm" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1" aria-haspopup="true" aria-expanded={isCalcOpen} onClick={() => setIsCalcOpen((o) => !o)}>
                        {t.calculator}
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      </Button>
                   </div>
                   <div className={`absolute top-full right-0 w-56 bg-white shadow-xl rounded-lg border border-gray-100 group-hover:block group-focus-within:block pt-4 ${isCalcOpen ? 'block' : 'hidden'}`}>
                      <div className="py-2 flex flex-col bg-white rounded-lg">
                        <Link to="/calculator/legal-fee" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsCalcOpen(false)}>
                          {language === 'np' ? 'कानूनी शुल्क क्याल्कुलेटर' : 'Legal Fee Calculator'}
                        </Link>
                        <Link to="/calculator/other" className="px-4 py-3 hover:bg-green-50 text-gray-900 hover:text-secondary transition-colors text-sm" onClick={() => setIsCalcOpen(false)}>
                          {language === 'np' ? 'अन्य क्याल्कुलेटरहरू' : 'Other Calculators'}
                        </Link>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          {/* Mobile Menu Button - direct child of the top row so it stays visible on mobile */}
          <button 
              className="lg:hidden p-3 text-gray-600 hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
          >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
        <div 
            id="mobile-menu"
            className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
                isMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
            }`}
        >
            {/* Backdrop */}
            <button 
              type="button" 
              tabIndex={-1} 
              aria-hidden="true" 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full border-none cursor-default" 
            />
            
            {/* Menu Panel */}
            <div className={`absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xl font-serif font-bold text-primary">{t.firmName}</span>
                        <button 
                          onClick={() => setIsMenuOpen(false)} 
                          className="p-3 text-gray-500 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary rounded-full"
                          aria-label="Close menu"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                        <div className="flex flex-col space-y-4">
                            <Link to="/" className="text-lg font-medium text-gray-900 hover:text-secondary" onClick={() => setIsMenuOpen(false)}>{t.navHome}</Link>
                            
                            {/* About Dropdown (Mobile) */}
                            <div className="space-y-3 pt-2">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.navAbout}</p>
                                <Link to="/about" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navProfile}</Link>
                                <Link to="/team" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navTeam}</Link>
                            </div>

                            <Link to="/practice-areas" className="text-lg font-medium text-gray-900 hover:text-secondary" onClick={() => setIsMenuOpen(false)}>{t.navPractice}</Link>
                            
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.resources}</p>
                                <Link to="/news" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navNews}</Link>
                                <Link to="/notices" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navNotices}</Link>
                                <Link to="/research" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navResearch}</Link>
                                <Link to="/faq" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>{t.navFAQ}</Link>
                            </div>

                            <Link to="/contact" className="text-lg font-medium text-gray-900 hover:text-secondary pt-2 border-t border-gray-100" onClick={() => setIsMenuOpen(false)}>{t.navContact}</Link>
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-4">
                            {/* Language Switcher (Mobile) */}
                            <button 
                                onClick={() => {
                                    setLanguage(language === 'en' ? 'np' : 'en');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold"
                            >
                                {language === 'en' ? 'Switch to Nepali 🇳🇵' : 'Switch to English 🇺🇸'}
                            </button>

                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.calculator}</p>
                                <Link to="/calculator/legal-fee" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>
                                    {language === 'np' ? 'कानूनी शुल्क क्याल्कुलेटर' : 'Legal Fee Calculator'}
                                </Link>
                                <Link to="/calculator/other" className="block text-gray-600 hover:text-secondary pl-4" onClick={() => setIsMenuOpen(false)}>
                                    {language === 'np' ? 'अन्य क्याल्कुलेटरहरू' : 'Other Calculators'}
                                </Link>
                            </div>
                            
                            <a href="tel:+9779861292120" className="flex items-center justify-center gap-2 text-gray-600 hover:text-secondary p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors">
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">+977 9861292120</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};