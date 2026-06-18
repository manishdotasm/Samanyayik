

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { AccessibilityPanel } from './components/Layout/AccessibilityPanel';
import ScrollToTop from './components/Shared/ScrollToTop';
import KeyboardShortcuts from './components/Shared/KeyboardShortcuts';
import Home from './pages/Home';
import LegalFeeCalculator from './pages/LegalFeeCalculator';
import OtherCalculators from './pages/OtherCalculators';
import PracticeAreasPage from './pages/PracticeAreasPage';
import PracticeAreaDetailPage from './pages/PracticeAreaDetailPage';
import About from './pages/About';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import FAQPage from './pages/FAQPage';
import NoticesPage from './pages/NoticesPage';
import ResearchPage from './pages/ResearchPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import TeamPage from './pages/TeamPage';
import TeamDetailPage from './pages/TeamDetailPage';

const AppContent: React.FC = () => {
  const { readingRuler, readingMask, virtualKeyboard } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    if (readingRuler || readingMask) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [readingRuler, readingMask]);

  const handleKeyClick = (char: string) => {
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const start = activeEl.selectionStart || 0;
      const end = activeEl.selectionEnd || 0;
      const text = activeEl.value;
      
      if (char === 'Backspace') {
        if (start > 0 || end > start) {
          const deleteCount = start === end ? 1 : 0;
          const newStart = start === end ? start - 1 : start;
          activeEl.value = text.slice(0, newStart) + text.slice(end);
          activeEl.setSelectionRange(newStart, newStart);
        }
      } else {
        activeEl.value = text.slice(0, start) + char + text.slice(end);
        const newPos = start + char.length;
        activeEl.setSelectionRange(newPos, newPos);
      }
      
      const event = new Event('input', { bubbles: true });
      activeEl.dispatchEvent(event);
      activeEl.focus();
    }
  };

  const keyboardKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
    ['Space', 'Backspace']
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300">
      {/* Skip Links - Must be at the very top of the DOM for proper tab order.
          Uses onClick instead of href hash because the app uses HashRouter,
          which would otherwise hijack the hash and break routing. */}
      <a 
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('main-content');
          if (el) {
            el.focus({ preventScroll: false });
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-secondary focus:text-white focus:rounded-lg focus:font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        Skip to Main Content
      </a>
      <a 
        href="#footer-content"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('footer-content');
          if (el) {
            el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: false });
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:mt-14 focus:px-4 focus:py-2 focus:bg-secondary focus:text-white focus:rounded-lg focus:font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        Skip to Footer
      </a>
      
      <header>
        <Navbar />
      </header>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/calculator/legal-fee" element={<LegalFeeCalculator />} />
          <Route path="/calculator/other" element={<OtherCalculators />} />
          <Route path="/practice-areas" element={<PracticeAreasPage />} />
          <Route path="/practice-areas/:serviceId" element={<PracticeAreaDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </div>
      <Footer />
      
      {/* Accessibility Panel */}
      <aside aria-label="Accessibility Tools" className="accessibility-exclude">
        <AccessibilityPanel />
      </aside>

      {/* Reading Ruler */}
      {readingRuler && (
        <div 
          className="fixed left-0 w-full h-1 bg-green-600/80 z-[9999] pointer-events-none shadow-[0_0_8px_rgba(22,163,74,0.5)]"
          style={{ top: `${mouseY}px` }}
        />
      )}

      {/* Reading Mask */}
      {readingMask && (
        <>
          <div 
            className="fixed left-0 top-0 w-full bg-black/65 z-[9998] pointer-events-none"
            style={{ height: `${Math.max(0, mouseY - 60)}px` }}
          />
          <div 
            className="fixed left-0 w-full bottom-0 bg-black/65 z-[9998] pointer-events-none"
            style={{ top: `${mouseY + 60}px` }}
          />
        </>
      )}

      {/* Virtual Keyboard */}
      {virtualKeyboard && (
        <div 
          className="fixed bottom-20 right-4 z-[9999] bg-gray-900/95 border border-gray-700 p-4 rounded-xl shadow-2xl w-80 sm:w-96 text-white select-none animate-fade-in-up"
          role="complementary"
          aria-label="On-Screen Virtual Keyboard"
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
            <span className="text-xs font-bold font-sans tracking-wide uppercase text-gray-400">Virtual Keyboard</span>
            <p className="text-[10px] text-gray-500 font-sans">Click on any input field first</p>
          </div>
          
          <div className="space-y-2">
            {keyboardKeys.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((k) => {
                  const isWide = k === 'Space' || k === 'Backspace';
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        if (k === 'Space') handleKeyClick(' ');
                        else handleKeyClick(k);
                      }}
                      className={`h-9 rounded font-sans font-semibold text-xs active:scale-95 transition-all flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white border border-gray-700
                        ${isWide ? 'flex-grow px-4 font-bold text-gray-300 bg-gray-800 hover:bg-gray-700' : 'w-7 sm:w-8'}
                      `}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <Router>
        <ScrollToTop />
        <KeyboardShortcuts />
        <AppContent />
      </Router>
    </AccessibilityProvider>
  );
};

export default App;