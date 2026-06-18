import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

export type ThemeMode = 'default' | 'contrast-dark' | 'contrast-light' | 'sepia';
export type CustomTextColor = 'default' | 'green' | 'blue' | 'yellow';
export type ColorBlindness = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type TextAlignment = 'default' | 'left' | 'right' | 'center' | 'justify';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: number;
  setFontSize: (val: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  language: Language;
  setLanguage: (val: Language) => void;
  isDyslexicFont: boolean;
  setIsDyslexicFont: (val: boolean) => void;
  areLinksUnderlined: boolean;
  setAreLinksUnderlined: (val: boolean) => void;
  isBoldText: boolean;
  setIsBoldText: (val: boolean) => void;

  // Extended aids
  simplifiedMode: boolean;
  setSimplifiedMode: (val: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (val: ThemeMode) => void;
  grayscaleMode: boolean;
  setGrayscaleMode: (val: boolean) => void;
  invertMode: boolean;
  setInvertMode: (val: boolean) => void;
  customTextColor: CustomTextColor;
  setCustomTextColor: (val: CustomTextColor) => void;
  colorBlindness: ColorBlindness;
  setColorBlindness: (val: ColorBlindness) => void;
  lineHeight: number;
  setLineHeight: (val: number) => void;
  wordSpacing: boolean;
  setWordSpacing: (val: boolean) => void;
  charSpacing: boolean;
  setCharSpacing: (val: boolean) => void;
  textAlignment: TextAlignment;
  setTextAlignment: (val: TextAlignment) => void;
  highlightLinks: boolean;
  setHighlightLinks: (val: boolean) => void;
  forceFocusOutline: boolean;
  setForceFocusOutline: (val: boolean) => void;
  oversizedCursor: boolean;
  setOversizedCursor: (val: boolean) => void;
  readingRuler: boolean;
  setReadingRuler: (val: boolean) => void;
  readingMask: boolean;
  setReadingMask: (val: boolean) => void;
  virtualKeyboard: boolean;
  setVirtualKeyboard: (val: boolean) => void;
  readAloud: boolean;
  setReadAloud: (val: boolean) => void;
  minimalistMode: boolean;
  setMinimalistMode: (val: boolean) => void;

  resetAll: () => void;
  announceChange: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getStored = <T,>(key: string, fallback: T): T => {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    try {
      if (typeof fallback === 'boolean') {
        return (item === 'true') as unknown as T;
      }
      if (typeof fallback === 'number') {
        return Number(item) as unknown as T;
      }
      return item as unknown as T;
    } catch {
      return fallback;
    }
  };

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getStored('themeMode', 'default'));
  const [highContrast, setHighContrastState] = useState<boolean>(() => themeMode === 'contrast-dark');
  const [fontSize, setFontSize] = useState<number>(() => getStored('fontSize', 100));
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => getStored('reduceMotion', false));
  const [language, setLanguage] = useState<Language>(() => getStored('language', 'en'));
  const [isDyslexicFont, setIsDyslexicFont] = useState<boolean>(() => getStored('isDyslexicFont', false));
  const [areLinksUnderlined, setAreLinksUnderlined] = useState<boolean>(() => getStored('areLinksUnderlined', false));
  const [isBoldText, setIsBoldText] = useState<boolean>(() => getStored('isBoldText', false));

  const [simplifiedMode, setSimplifiedMode] = useState<boolean>(() => getStored('simplifiedMode', false));
  const [grayscaleMode, setGrayscaleMode] = useState<boolean>(() => getStored('grayscaleMode', false));
  const [invertMode, setInvertMode] = useState<boolean>(() => getStored('invertMode', false));
  const [customTextColor, setCustomTextColor] = useState<CustomTextColor>(() => getStored('customTextColor', 'default'));
  const [colorBlindness, setColorBlindness] = useState<ColorBlindness>(() => getStored('colorBlindness', 'none'));
  const [lineHeight, setLineHeight] = useState<number>(() => getStored('lineHeight', 1.0));
  const [wordSpacing, setWordSpacing] = useState<boolean>(() => getStored('wordSpacing', false));
  const [charSpacing, setCharSpacing] = useState<boolean>(() => getStored('charSpacing', false));
  const [textAlignment, setTextAlignment] = useState<TextAlignment>(() => getStored('textAlignment', 'default'));
  const [highlightLinks, setHighlightLinks] = useState<boolean>(() => getStored('highlightLinks', false));
  const [forceFocusOutline, setForceFocusOutline] = useState<boolean>(() => getStored('forceFocusOutline', false));
  const [oversizedCursor, setOversizedCursor] = useState<boolean>(() => getStored('oversizedCursor', false));
  const [readingRuler, setReadingRuler] = useState<boolean>(() => getStored('readingRuler', false));
  const [readingMask, setReadingMask] = useState<boolean>(() => getStored('readingMask', false));
  const [virtualKeyboard, setVirtualKeyboard] = useState<boolean>(() => getStored('virtualKeyboard', false));
  const [readAloud, setReadAloud] = useState<boolean>(() => getStored('readAloud', false));
  const [minimalistMode, setMinimalistMode] = useState<boolean>(() => getStored('minimalistMode', false));

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setHighContrastState(mode === 'contrast-dark');
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    setThemeModeState(val ? 'contrast-dark' : 'default');
  };

  // Sync state to localStorage
  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('fontSize', String(fontSize)); }, [fontSize]);
  useEffect(() => { localStorage.setItem('reduceMotion', String(reduceMotion)); }, [reduceMotion]);
  useEffect(() => { localStorage.setItem('language', language); }, [language]);
  useEffect(() => { localStorage.setItem('isDyslexicFont', String(isDyslexicFont)); }, [isDyslexicFont]);
  useEffect(() => { localStorage.setItem('areLinksUnderlined', String(areLinksUnderlined)); }, [areLinksUnderlined]);
  useEffect(() => { localStorage.setItem('isBoldText', String(isBoldText)); }, [isBoldText]);
  useEffect(() => { localStorage.setItem('simplifiedMode', String(simplifiedMode)); }, [simplifiedMode]);
  useEffect(() => { localStorage.setItem('grayscaleMode', String(grayscaleMode)); }, [grayscaleMode]);
  useEffect(() => { localStorage.setItem('invertMode', String(invertMode)); }, [invertMode]);
  useEffect(() => { localStorage.setItem('customTextColor', customTextColor); }, [customTextColor]);
  useEffect(() => { localStorage.setItem('colorBlindness', colorBlindness); }, [colorBlindness]);
  useEffect(() => { localStorage.setItem('lineHeight', String(lineHeight)); }, [lineHeight]);
  useEffect(() => { localStorage.setItem('wordSpacing', String(wordSpacing)); }, [wordSpacing]);
  useEffect(() => { localStorage.setItem('charSpacing', String(charSpacing)); }, [charSpacing]);
  useEffect(() => { localStorage.setItem('textAlignment', textAlignment); }, [textAlignment]);
  useEffect(() => { localStorage.setItem('highlightLinks', String(highlightLinks)); }, [highlightLinks]);
  useEffect(() => { localStorage.setItem('forceFocusOutline', String(forceFocusOutline)); }, [forceFocusOutline]);
  useEffect(() => { localStorage.setItem('oversizedCursor', String(oversizedCursor)); }, [oversizedCursor]);
  useEffect(() => { localStorage.setItem('readingRuler', String(readingRuler)); }, [readingRuler]);
  useEffect(() => { localStorage.setItem('readingMask', String(readingMask)); }, [readingMask]);
  useEffect(() => { localStorage.setItem('virtualKeyboard', String(virtualKeyboard)); }, [virtualKeyboard]);
  useEffect(() => { localStorage.setItem('readAloud', String(readAloud)); }, [readAloud]);
  useEffect(() => { localStorage.setItem('minimalistMode', String(minimalistMode)); }, [minimalistMode]);

  // Apply Font Size to Root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // Apply Theme Mode classes
  useEffect(() => {
    const cl = document.body.classList;
    cl.remove('contrast-dark', 'contrast-light', 'theme-sepia', 'high-contrast');
    if (themeMode === 'contrast-dark') {
      cl.add('contrast-dark', 'high-contrast');
    } else if (themeMode === 'contrast-light') {
      cl.add('contrast-light');
    } else if (themeMode === 'sepia') {
      cl.add('theme-sepia');
    }
  }, [themeMode]);

  // Apply Grayscale Filter
  useEffect(() => {
    if (grayscaleMode) {
      document.documentElement.classList.add('grayscale-active');
    } else {
      document.documentElement.classList.remove('grayscale-active');
    }
  }, [grayscaleMode]);

  // Apply Global Color Invert
  useEffect(() => {
    if (invertMode) {
      document.documentElement.classList.add('invert-active');
    } else {
      document.documentElement.classList.remove('invert-active');
    }
  }, [invertMode]);

  // Apply Custom Text Color Overrides
  useEffect(() => {
    const cl = document.body.classList;
    cl.remove('text-override-green', 'text-override-blue', 'text-override-yellow');
    if (customTextColor !== 'default') {
      cl.add(`text-override-${customTextColor}`);
    }
  }, [customTextColor]);

  // Apply Color-Blindness Correction
  useEffect(() => {
    const cl = document.documentElement.classList;
    cl.remove('color-blind-protanopia', 'color-blind-deuteranopia', 'color-blind-tritanopia', 'color-blind-achromatopsia');
    if (colorBlindness !== 'none') {
      cl.add(`color-blind-${colorBlindness}`);
    }
  }, [colorBlindness]);

  // Apply Dyslexic Font
  useEffect(() => {
    if (isDyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
  }, [isDyslexicFont]);

  // Apply Underline Links
  useEffect(() => {
    if (areLinksUnderlined) {
      document.body.classList.add('underline-links');
    } else {
      document.body.classList.remove('underline-links');
    }
  }, [areLinksUnderlined]);

  // Apply Bold Text
  useEffect(() => {
    if (isBoldText) {
      document.body.classList.add('bold-text');
    } else {
      document.body.classList.remove('bold-text');
    }
  }, [isBoldText]);

  // Apply Line Height Options
  useEffect(() => {
    const cl = document.body.classList;
    cl.remove('line-height-1-5', 'line-height-2-0');
    if (lineHeight === 1.5) {
      cl.add('line-height-1-5');
    } else if (lineHeight === 2.0) {
      cl.add('line-height-2-0');
    }
  }, [lineHeight]);

  // Apply Word Spacing Adjuster
  useEffect(() => {
    if (wordSpacing) {
      document.body.classList.add('word-spacing-expanded');
    } else {
      document.body.classList.remove('word-spacing-expanded');
    }
  }, [wordSpacing]);

  // Apply Character Spacing Adjuster
  useEffect(() => {
    if (charSpacing) {
      document.body.classList.add('char-spacing-expanded');
    } else {
      document.body.classList.remove('char-spacing-expanded');
    }
  }, [charSpacing]);

  // Apply Custom Text Alignment Force
  useEffect(() => {
    const cl = document.body.classList;
    cl.remove('force-align-left', 'force-align-right', 'force-align-center', 'force-align-justify');
    if (textAlignment !== 'default') {
      cl.add(`force-align-${textAlignment}`);
    }
  }, [textAlignment]);

  // Apply Visual Link Highlighter
  useEffect(() => {
    if (highlightLinks) {
      document.body.classList.add('highlight-links-active');
    } else {
      document.body.classList.remove('highlight-links-active');
    }
  }, [highlightLinks]);

  // Apply Large Focus Outline Force
  useEffect(() => {
    if (forceFocusOutline) {
      document.body.classList.add('force-focus-outline-active');
    } else {
      document.body.classList.remove('force-focus-outline-active');
    }
  }, [forceFocusOutline]);

  // Apply Oversized High-Contrast Cursor
  useEffect(() => {
    if (oversizedCursor) {
      document.body.classList.add('oversized-cursor-active');
    } else {
      document.body.classList.remove('oversized-cursor-active');
    }
  }, [oversizedCursor]);

  // Apply Clean Minimalist Mode
  useEffect(() => {
    if (minimalistMode) {
      document.body.classList.add('minimalist-mode-active');
    } else {
      document.body.classList.remove('minimalist-mode-active');
    }
  }, [minimalistMode]);

  // Apply Reduced Motion / Animation Pause
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.style.scrollBehavior = 'auto';
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, [reduceMotion]);

  // Speech Synthesis Read Aloud
  useEffect(() => {
    if (!readAloud) {
      window.speechSynthesis?.cancel();
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A', 'LI', 'LABEL', 'TH', 'TD'];
      if (validTags.includes(target.tagName) && target.innerText) {
        window.speechSynthesis?.cancel();
        const utterance = new SpeechSynthesisUtterance(target.innerText.trim());
        utterance.lang = language === 'np' ? 'ne-NP' : 'en-US';
        window.speechSynthesis?.speak(utterance);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A', 'LI', 'LABEL', 'TH', 'TD'];
      if (validTags.includes(target.tagName)) {
        window.speechSynthesis?.cancel();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.speechSynthesis?.cancel();
    };
  }, [readAloud, language]);

  const resetAll = () => {
    localStorage.clear();
    setThemeModeState('default');
    setHighContrastState(false);
    setFontSize(100);
    setReduceMotion(false);
    setIsDyslexicFont(false);
    setAreLinksUnderlined(false);
    setIsBoldText(false);
    setSimplifiedMode(false);
    setGrayscaleMode(false);
    setInvertMode(false);
    setCustomTextColor('default');
    setColorBlindness('none');
    setLineHeight(1.0);
    setWordSpacing(false);
    setCharSpacing(false);
    setTextAlignment('default');
    setHighlightLinks(false);
    setForceFocusOutline(false);
    setOversizedCursor(false);
    setReadingRuler(false);
    setReadingMask(false);
    setVirtualKeyboard(false);
    setReadAloud(false);
    setMinimalistMode(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        reduceMotion,
        setReduceMotion,
        language,
        setLanguage,
        isDyslexicFont,
        setIsDyslexicFont,
        areLinksUnderlined,
        setAreLinksUnderlined,
        isBoldText,
        setIsBoldText,
        simplifiedMode,
        setSimplifiedMode,
        themeMode,
        setThemeMode,
        grayscaleMode,
        setGrayscaleMode,
        invertMode,
        setInvertMode,
        customTextColor,
        setCustomTextColor,
        colorBlindness,
        setColorBlindness,
        lineHeight,
        setLineHeight,
        wordSpacing,
        setWordSpacing,
        charSpacing,
        setCharSpacing,
        textAlignment,
        setTextAlignment,
        highlightLinks,
        setHighlightLinks,
        forceFocusOutline,
        setForceFocusOutline,
        oversizedCursor,
        setOversizedCursor,
        readingRuler,
        setReadingRuler,
        readingMask,
        setReadingMask,
        virtualKeyboard,
        setVirtualKeyboard,
        readAloud,
        setReadAloud,
        minimalistMode,
        setMinimalistMode,
        resetAll,
        announceChange: (message) => {
          const liveRegion = document.getElementById('accessibility-live-region');
          if (liveRegion) {
            liveRegion.textContent = '';
            setTimeout(() => {
              liveRegion.textContent = message;
            }, 50);
          }
        }
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};