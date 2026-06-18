import React, { useState, useEffect, useRef } from 'react';
import { Eye, Type, Activity, Settings, Keyboard, RotateCcw, Volume2, AlignLeft, EyeOff, X } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Modal } from '../Shared/Modal';
import { TRANSLATIONS } from '../../constants';

/**
 * Accessible toggle switch built on a real <button>.
 * - Uses role="switch" + aria-checked, the recommended ARIA toggle pattern.
 * - The screen reader announces the name and state once (e.g.
 *   "Grayscale Filter, switch, on") natively, so no live region is needed.
 * - The coloured pill is purely decorative (aria-hidden).
 */
interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange, icon }) => (
  <div className="flex items-center justify-between">
    <span id={`${id}-label`} className="text-sm font-normal text-gray-700 flex items-center gap-1">
      {icon}
      {label}
    </span>
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer bg-transparent border-0 p-0 focus:outline-none group"
    >
      <span
        aria-hidden="true"
        className={`block w-12 h-6 rounded-full relative transition-colors group-focus-visible:ring-2 group-focus-visible:ring-green-400 group-focus-visible:ring-offset-1 ${checked ? 'bg-secondary' : 'bg-gray-200'} after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${checked ? 'after:left-[26px]' : 'after:left-[2px]'}`}
      ></span>
    </button>
  </div>
);

export const AccessibilityPanel: React.FC = () => {
  const {
    highContrast, setHighContrast,
    fontSize, setFontSize,
    reduceMotion, setReduceMotion,
    language, setLanguage,
    isDyslexicFont, setIsDyslexicFont,
    areLinksUnderlined, setAreLinksUnderlined,
    isBoldText, setIsBoldText,
    simplifiedMode, setSimplifiedMode,
    themeMode, setThemeMode,
    grayscaleMode, setGrayscaleMode,
    invertMode, setInvertMode,
    customTextColor, setCustomTextColor,
    colorBlindness, setColorBlindness,
    lineHeight, setLineHeight,
    wordSpacing, setWordSpacing,
    charSpacing, setCharSpacing,
    textAlignment, setTextAlignment,
    highlightLinks, setHighlightLinks,
    forceFocusOutline, setForceFocusOutline,
    oversizedCursor, setOversizedCursor,
    readingRuler, setReadingRuler,
    readingMask, setReadingMask,
    virtualKeyboard, setVirtualKeyboard,
    readAloud, setReadAloud,
    minimalistMode, setMinimalistMode,
    resetAll
  } = useAccessibility();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const t = TRANSLATIONS[language];
  const [showTooltip, setShowTooltip] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  // Track whether the panel was just opened so we only auto-focus once on open
  const justOpenedRef = useRef(false);

  // Function to announce changes to screen readers
  const announceChange = (message: string) => {
    if (liveRegionRef.current) {
      // Clear and set the message to trigger screen reader announcement
      liveRegionRef.current.textContent = '';
      setTimeout(() => {
        liveRegionRef.current!.textContent = message;
      }, 50);
    }
  };

  // Handle font size changes with announcement (expressed in em)
  const handleFontSizeChange = (newSize: number) => {
    const newEm = (newSize / 100).toFixed(1);
    if (newSize > fontSize) {
      announceChange(`Font increased by 0.1em, now ${newEm}em`);
    } else if (newSize < fontSize) {
      announceChange(`Font decreased by 0.1em, now ${newEm}em`);
    } else {
      announceChange(`Font size ${newEm}em`);
    }
    setFontSize(newSize);
  };

  // Global hotkeys handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const isMacShortcut = event.ctrlKey && event.altKey && event.shiftKey && event.code === 'KeyA';
        const isWindowsShortcut = event.altKey && event.shiftKey && !event.ctrlKey && event.code === 'KeyA';

        if (isMacShortcut || isWindowsShortcut) {
            event.preventDefault();
            setIsOpen(prev => !prev);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard Focus Trapping and Escape closure
  useEffect(() => {
    if (!isOpen) {
      // Restore focus to the trigger without scrolling the page
      triggerRef.current?.focus({ preventScroll: true });
      justOpenedRef.current = false;
      return;
    }

    // Only auto-focus the first item on the initial open, not on every
    // internal re-render caused by toggling a setting inside the panel.
    if (!justOpenedRef.current) {
      justOpenedRef.current = true;
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus({ preventScroll: true });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        e.preventDefault();
        return;
      }

      if (e.key !== 'Tab') return;

      const elements = menuRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (!elements || elements.length === 0) return;

      const firstEl = elements[0];
      const lastEl = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus({ preventScroll: true });
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus({ preventScroll: true });
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center group">
        <button 
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className="p-3 bg-secondary text-white rounded-full shadow-lg hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 relative"
            aria-label={language === 'np' ? "पहुँचयोग्यता उपकरणहरू (Alt + Shift + A)" : "Accessibility Tools (Alt + Shift + A)"}
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-controls="accessibility-menu"
        >
            <Settings className="w-6 h-6" role="img" />
        </button>

        {/* Tooltip */}
        <div 
            className={`absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap transition-opacity duration-200 pointer-events-none z-50 ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
            role="tooltip"
            aria-hidden={!showTooltip}
        >
            Press Alt + Shift + A (or Ctrl + Opt + Shift + A on Mac).
            {/* Arrow */}
            <div className="absolute top-1/2 right-full -mt-1 -mr-1 border-4 border-transparent border-r-gray-900"></div>
        </div>

        {isOpen && (
            <div 
                ref={menuRef}
                id="accessibility-menu" 
                className="absolute bottom-16 left-0 bg-white border border-gray-200 shadow-2xl rounded-xl p-6 w-72 sm:w-80 max-h-[80vh] overflow-y-auto space-y-6 animate-fade-in-up text-black" 
                role="dialog" 
                aria-modal="true" 
                aria-label="Accessibility Customization Panel"
            >
                {/* Live Region for announcements (inside the panel, but visible to screen readers) */}
                <div aria-live="polite" aria-atomic="true" className="sr-only" id="accessibility-live-region" ref={liveRegionRef}></div>
                {/* Header with Close and Reset */}
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <h3 className="font-serif font-bold text-xl text-black">Accessibility</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={resetAll}
                            className="p-2 text-gray-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full"
                            aria-label="Reset all accessibility settings"
                            title="Reset All"
                        >
                            <RotateCcw className="w-5 h-5" role="img" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-secondary focus:ring-2 focus:ring-secondary rounded-full"
                            aria-label="Close accessibility panel"
                            title="Close"
                        >
                            <X className="w-5 h-5" role="img" />
                        </button>
                    </div>
                </div>

                {/* 1. Theme Configuration */}
                <div className="space-y-2">
                    <label htmlFor="theme-select" className="block text-sm font-sans font-bold text-gray-800">Color Theme</label>
                    <select
                        id="theme-select"
                        value={themeMode}
                        onChange={(e) => setThemeMode(e.target.value as any)}
                        className="w-full p-2 border-2 border-gray-200 rounded text-sm bg-white font-sans font-normal"
                    >
                        <option value="default">Default Colors</option>
                        <option value="contrast-dark">High Contrast Dark (Yellow on Black)</option>
                        <option value="contrast-light">High Contrast Light (Black on White)</option>
                        <option value="sepia">Warm Sepia (Pastel Cream)</option>
                    </select>
                </div>

                {/* 2. Color-Blindness Correction */}
                <div className="space-y-2">
                    <label htmlFor="cb-select" className="block text-sm font-sans font-bold text-gray-800">Color-Blindness Correction</label>
                    <select
                        id="cb-select"
                        value={colorBlindness}
                        onChange={(e) => setColorBlindness(e.target.value as any)}
                        className="w-full p-2 border-2 border-gray-200 rounded text-sm bg-white font-sans font-normal"
                    >
                        <option value="none">None (Default)</option>
                        <option value="protanopia">Protanopia (Red-Blindness)</option>
                        <option value="deuteranopia">Deuteranopia (Green-Blindness)</option>
                        <option value="tritanopia">Tritanopia (Blue-Blindness)</option>
                        <option value="achromatopsia">Achromatopsia (Total Color-Blindness)</option>
                    </select>
                </div>

                {/* 3. Custom Body Text Color Override */}
                <div className="space-y-2">
                    <label htmlFor="text-color-select" className="block text-sm font-sans font-bold text-gray-800">Override Text Color</label>
                    <select
                        id="text-color-select"
                        value={customTextColor}
                        onChange={(e) => setCustomTextColor(e.target.value as any)}
                        className="w-full p-2 border-2 border-gray-200 rounded text-sm bg-white font-sans font-normal"
                    >
                        <option value="default">Default Text Color</option>
                        <option value="green">High-Visibility Green</option>
                        <option value="blue">High-Visibility Blue</option>
                        <option value="yellow">High-Visibility Yellow</option>
                    </select>
                </div>

                {/* 4. Color Filters (Grayscale, Invert) */}
                <div className="space-y-3">
                    <h4 className="font-sans font-bold text-sm text-gray-800 border-b pb-1 border-gray-100">Color Filters</h4>
                    
                    <ToggleSwitch
                        id="grayscale-toggle"
                        label="Grayscale Filter"
                        checked={grayscaleMode}
                        onChange={setGrayscaleMode}
                    />

                    <ToggleSwitch
                        id="invert-toggle"
                        label="Invert Page Colors"
                        checked={invertMode}
                        onChange={setInvertMode}
                    />
                </div>

                {/* 5. Typography Adjustment */}
                <div className="space-y-4">
                    <h4 className="font-sans font-bold text-sm text-gray-800 border-b pb-1 border-gray-100">Typography & Spacing</h4>

                    {/* Font Size */}
                    <div className="space-y-1">
                        <span className="text-sm font-normal text-gray-700">Font Size ({(fontSize / 100).toFixed(1)}em)</span>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleFontSizeChange(Math.max(100, fontSize - 10))} 
                                className="flex-1 bg-gray-100 text-black font-bold py-2 px-3 min-h-[44px] min-w-[44px] text-sm rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary border border-gray-300 flex items-center justify-center"
                                aria-label="Decrease font size"
                            >
                                -A
                                <span className="sr-only">Decrease font size by 0.1em (currently {(fontSize / 100).toFixed(1)}em)</span>
                            </button>
                            <button 
                                onClick={() => handleFontSizeChange(Math.min(200, fontSize + 10))} 
                                className="flex-1 bg-gray-100 text-black font-bold py-2 px-3 min-h-[44px] min-w-[44px] text-sm rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary border border-gray-300 flex items-center justify-center"
                                aria-label="Increase font size"
                            >
                                +A
                                <span className="sr-only">Increase font size by 0.1em (currently {(fontSize / 100).toFixed(1)}em)</span>
                            </button>
                        </div>
                    </div>

                    {/* Line Height */}
                    <div className="space-y-2">
                        <label htmlFor="lh-select" className="block text-sm font-normal text-gray-700">Line Spacing (Height)</label>
                        <select
                            id="lh-select"
                            value={lineHeight}
                            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                            className="w-full p-2 border-2 border-gray-200 rounded text-sm bg-white font-sans font-normal"
                        >
                            <option value="1.0">Default Spacing</option>
                            <option value="1.5">Expanded (1.5x)</option>
                            <option value="2.0">Double Spacing (2.0x)</option>
                        </select>
                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-2">
                        <label htmlFor="align-select" className="block text-sm font-normal text-gray-700">Force Text Alignment</label>
                        <select
                            id="align-select"
                            value={textAlignment}
                            onChange={(e) => setTextAlignment(e.target.value as any)}
                            className="w-full p-2 border-2 border-gray-200 rounded text-sm bg-white font-sans font-normal"
                        >
                            <option value="default">Default Alignment</option>
                            <option value="left">Force Align Left</option>
                            <option value="right">Force Align Right</option>
                            <option value="center">Force Align Center</option>
                            <option value="justify">Force Align Justify</option>
                        </select>
                    </div>

                    {/* Spacing Checkboxes */}
                    <ToggleSwitch
                        id="word-spacing-toggle"
                        label="Expand Word Spacing (+0.16em)"
                        checked={wordSpacing}
                        onChange={setWordSpacing}
                    />

                    <ToggleSwitch
                        id="char-spacing-toggle"
                        label="Expand Letter Spacing (+0.12em)"
                        checked={charSpacing}
                        onChange={setCharSpacing}
                    />

                    {/* Dyslexic Font */}
                    <ToggleSwitch
                        id="dyslexic-font-toggle"
                        label="Atkinson Dyslexia Font"
                        checked={isDyslexicFont}
                        onChange={setIsDyslexicFont}
                    />

                    {/* Bold Text */}
                    <ToggleSwitch
                        id="bold-text-toggle"
                        label="Bold Text Force"
                        checked={isBoldText}
                        onChange={setIsBoldText}
                    />
                </div>

                {/* 6. Reading Aids & Guides */}
                <div className="space-y-4">
                    <h4 className="font-sans font-bold text-sm text-gray-800 border-b pb-1 border-gray-100">Reading Aids</h4>

                    {/* Reading Ruler */}
                    <ToggleSwitch
                        id="reading-ruler-toggle"
                        label="Horizontal Reading Ruler"
                        checked={readingRuler}
                        onChange={setReadingRuler}
                    />

                    {/* Reading Mask */}
                    <ToggleSwitch
                        id="reading-mask-toggle"
                        label="Focus Reading Mask"
                        checked={readingMask}
                        onChange={setReadingMask}
                    />

                    {/* Speech synthesis Read-aloud */}
                    <ToggleSwitch
                        id="read-aloud-toggle"
                        label="Hover Read-Aloud"
                        checked={readAloud}
                        onChange={setReadAloud}
                        icon={<Volume2 className="w-4 h-4 text-gray-500" aria-hidden="true" />}
                    />
                </div>

                {/* 7. Controls & Links */}
                <div className="space-y-4">
                    <h4 className="font-sans font-bold text-sm text-gray-800 border-b pb-1 border-gray-100">Controls & UI aids</h4>

                    {/* Virtual Keyboard */}
                    <ToggleSwitch
                        id="virtual-keyboard-toggle"
                        label="Virtual Keyboard Display"
                        checked={virtualKeyboard}
                        onChange={setVirtualKeyboard}
                    />

                    {/* Link Highlighter */}
                    <ToggleSwitch
                        id="highlight-links-toggle"
                        label="Visual Link Highlighter"
                        checked={highlightLinks}
                        onChange={setHighlightLinks}
                    />

                    {/* Large Focus outline */}
                    <ToggleSwitch
                        id="focus-outline-toggle"
                        label="Large Focus Outline Force"
                        checked={forceFocusOutline}
                        onChange={setForceFocusOutline}
                    />

                    {/* Custom Cursor */}
                    <ToggleSwitch
                        id="cursor-toggle"
                        label="Oversized High-Contrast Cursor"
                        checked={oversizedCursor}
                        onChange={setOversizedCursor}
                    />

                    {/* Underline Links */}
                    <ToggleSwitch
                        id="underline-links-toggle"
                        label="Underline Links"
                        checked={areLinksUnderlined}
                        onChange={setAreLinksUnderlined}
                    />

                    {/* Pause Animations */}
                    <ToggleSwitch
                        id="animations-toggle"
                        label="Pause All Animations"
                        checked={reduceMotion}
                        onChange={setReduceMotion}
                        icon={<Activity className="w-4 h-4 text-gray-500" aria-hidden="true" />}
                    />

                    {/* Clean Minimalist Mode */}
                    <ToggleSwitch
                        id="minimalist-toggle"
                        label="Clean Minimalist Mode"
                        checked={minimalistMode}
                        onChange={setMinimalistMode}
                        icon={<EyeOff className="w-4 h-4 text-gray-500" aria-hidden="true" />}
                    />

                    {/* Simplified Reading Level */}
                    <ToggleSwitch
                        id="simplified-toggle"
                        label="Plain Simplified Text"
                        checked={simplifiedMode}
                        onChange={setSimplifiedMode}
                        icon={<AlignLeft className="w-4 h-4 text-gray-500" aria-hidden="true" />}
                    />
                </div>

                {/* Keyboard Shortcuts Trigger */}
                <div className="pt-3 border-t border-gray-100">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsShortcutsModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 min-h-[44px]"
                    >
                        <Keyboard className="w-4 h-4" role="img" />
                        <span>{language === 'np' ? 'किबोर्ड शॉर्टकट हेर्नुहोस्' : 'View Keyboard Shortcuts'}</span>
                    </button>
                </div>
            </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        <Modal
            isOpen={isShortcutsModalOpen}
            onClose={() => setIsShortcutsModalOpen(false)}
            title={language === 'np' ? 'किबोर्ड शॉर्टकटहरू' : 'Keyboard Shortcuts'}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-6">
                <p className="text-gray-600 text-sm mb-6 font-sans">
                    {language === 'np' 
                        ? 'वेबसाइट नेभिगेट गर्न र सुविधाहरू पहुँच गर्न किबोर्ड शॉर्टकटहरू प्रयोग गर्नुहोस्।'
                        : 'Use keyboard shortcuts to navigate the website and access features.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Navigation Shortcuts */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg text-black border-b pb-2">
                            {language === 'np' ? 'नेभिगेशन' : 'Navigation'}
                        </h3>
                        <ShortcutItem action={language === 'np' ? 'सामग्रीमा छोड्नुहोस्' : 'Skip to Content'} keys={['Alt + A']} />
                        <ShortcutItem action={language === 'np' ? 'गृहपृष्ठ' : 'Home'} keys={['Alt + H']} />
                        <ShortcutItem action={language === 'np' ? 'हाम्रो बारेमा' : 'About Us'} keys={['Alt + M']} />
                        <ShortcutItem action={language === 'np' ? 'हाम्रो टोली' : 'Our Team'} keys={['Alt + T']} />
                        <ShortcutItem action={language === 'np' ? 'हाम्रा सेवाहरू' : 'Practice Areas'} keys={['Alt + S']} />
                        <ShortcutItem action={language === 'np' ? 'समाचार' : 'News'} keys={['Alt + N']} />
                        <ShortcutItem action={language === 'np' ? 'सूचना पाटी' : 'Notice Board'} keys={['Alt + B']} />
                        <ShortcutItem action={language === 'np' ? 'अनुसन्धान' : 'Research'} keys={['Alt + 3']} />
                        <ShortcutItem action={language === 'np' ? 'मद्दत / प्राय: सोधिने प्रश्न' : 'Help / FAQ'} keys={['Alt + 6']} />
                        <ShortcutItem action={language === 'np' ? 'सम्पर्क गर्नुहोस्' : 'Contact Us'} keys={['Alt + U']} />
                        <ShortcutItem action={language === 'np' ? 'नियुक्ति बुक गर्नुहोस्' : 'Book Appointment'} keys={['Alt + L']} />
                        <ShortcutItem action={language === 'np' ? 'कानूनी शुल्क क्याल्कुलेटर' : 'Legal Fee Calculator'} keys={['Alt + 1']} />
                        <ShortcutItem action={language === 'np' ? 'अन्य क्याल्कुलेटरहरू' : 'Other Calculators'} keys={['Alt + 2']} />
                    </div>

                    {/* Accessibility & Feature Shortcuts */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg text-black border-b pb-2">
                            {language === 'np' ? 'पहुँचयोग्यता र सुविधाहरू' : 'Accessibility & Features'}
                        </h3>
                        <ShortcutItem action={language === 'np' ? 'पहुँचयोग्यता मेनु टगल' : 'Toggle Accessibility Menu'} keys={['Alt + Shift + A']} />
                        <ShortcutItem action={language === 'np' ? 'भाषा बदल्नुहोस् (EN/NP)' : 'Switch Language (EN/NP)'} keys={['Alt + I']} />
                        <ShortcutItem action={language === 'np' ? 'फन्ट साइज बढाउनुहोस्' : 'Increase Font Size'} keys={['Alt + =']} />
                        <ShortcutItem action={language === 'np' ? 'फन्ट साइज घटाउनुहोस्' : 'Decrease Font Size'} keys={['Alt + -']} />
                        <ShortcutItem action={language === 'np' ? 'उच्च कन्ट्रास्ट टगल' : 'Toggle High Contrast'} keys={['Alt + C']} />
                        <ShortcutItem action={language === 'np' ? 'ग्रेस्केल फिल्टर टगल' : 'Toggle Grayscale Filter'} keys={['Alt + Shift + G']} />
                        <ShortcutItem action={language === 'np' ? 'रङ उल्टाउनुहोस्' : 'Toggle Invert Colors'} keys={['Alt + J']} />
                        <ShortcutItem action={language === 'np' ? 'डिस्लेक्सिया फन्ट टगल' : 'Toggle Dyslexia Font'} keys={['Alt + K']} />
                        <ShortcutItem action={language === 'np' ? 'बाक्लो पाठ टगल' : 'Toggle Bold Text'} keys={['Alt + O']} />
                        <ShortcutItem action={language === 'np' ? 'लिङ्क अन्डरलाइन टगल' : 'Toggle Underline Links'} keys={['Alt + F']} />
                        <ShortcutItem action={language === 'np' ? 'पढ्ने रुलर टगल' : 'Toggle Reading Ruler'} keys={['Alt + Y']} />
                        <ShortcutItem action={language === 'np' ? 'पढ्ने मास्क टगल' : 'Toggle Reading Mask'} keys={['Alt + E']} />
                        <ShortcutItem action={language === 'np' ? 'एनिमेसन रोक्नुहोस्' : 'Toggle Pause Animations'} keys={['Alt + P']} />
                        <ShortcutItem action={language === 'np' ? 'होभर रिड-अलाउड टगल' : 'Toggle Hover Read-Aloud'} keys={['Alt + V']} />
                        <ShortcutItem action={language === 'np' ? 'भर्चुअल किबोर्ड टगल' : 'Toggle Virtual Keyboard'} keys={['Alt + W']} />
                        <ShortcutItem action={language === 'np' ? 'मिनिमलिस्ट मोड टगल' : 'Toggle Minimalist Mode'} keys={['Alt + Q']} />
                        <ShortcutItem action={language === 'np' ? 'सबै सेटिङ रिसेट गर्नुहोस्' : 'Reset All Settings'} keys={['Alt + 0']} />
                    </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 font-sans">
                        <strong>{language === 'np' ? 'नोट:' : 'Note:'}</strong>{' '}
                        {language === 'np' 
                            ? 'Windows/Linux मा Alt + Key प्रयोग गर्नुहोस्, Mac मा Ctrl + Option + Key प्रयोग गर्नुहोस्।'
                            : 'On Windows/Linux use Alt + Key. On Mac use Ctrl + Option + Key (e.g. Ctrl + Option + H for Home).'}
                    </p>
                </div>
            </div>
        </Modal>
    </div>
  );
};

const ShortcutItem: React.FC<{ action: string; keys: string[] }> = ({ action, keys }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-black font-sans">{action}</span>
      <div className="flex flex-wrap gap-2">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded text-gray-800"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
};
