import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const KeyboardShortcuts: React.FC = () => {
  const navigate = useNavigate();
  const {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    setHighContrast,
    highContrast,
    grayscaleMode,
    setGrayscaleMode,
    invertMode,
    setInvertMode,
    isDyslexicFont,
    setIsDyslexicFont,
    isBoldText,
    setIsBoldText,
    areLinksUnderlined,
    setAreLinksUnderlined,
    readingRuler,
    setReadingRuler,
    readingMask,
    setReadingMask,
    reduceMotion,
    setReduceMotion,
    readAloud,
    setReadAloud,
    virtualKeyboard,
    setVirtualKeyboard,
    minimalistMode,
    setMinimalistMode,
    resetAll,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle both Alt + Key (Windows/Linux) and Ctrl + Opt + Key (Mac)
      // On Mac: Ctrl + Opt triggers both ctrlKey and altKey
      // On Windows/Linux: Alt triggers altKey
      const isMacShortcut = event.ctrlKey && event.altKey;
      const isWindowsShortcut = event.altKey && !event.ctrlKey;

      if (isMacShortcut || isWindowsShortcut) {
        // --- Alt + Shift combinations (handled first to avoid clashes) ---
        if (event.shiftKey) {
          switch (event.code) {
            case 'KeyG': // Toggle Grayscale Filter - Alt + Shift + G
              event.preventDefault();
              setGrayscaleMode(!grayscaleMode);
              break;
            // Note: Alt + Shift + A (accessibility menu) is handled in AccessibilityPanel
          }
          return;
        }

        switch (event.code) {
          // --- Navigation Shortcuts ---
          case 'KeyA': // Skip to Content - Alt + A
            event.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              if (!mainContent.hasAttribute('tabindex')) {
                mainContent.setAttribute('tabindex', '-1');
              }
              mainContent.focus();
              mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            break;
          case 'KeyH': // Home
            event.preventDefault();
            navigate('/');
            break;
          case 'KeyM': // About Us
            event.preventDefault();
            navigate('/about');
            break;
          case 'KeyT': // Our Team
            event.preventDefault();
            navigate('/team');
            break;
          case 'KeyS': // Practice Areas / Services
            event.preventDefault();
            navigate('/practice-areas');
            break;
          case 'KeyN': // News
            event.preventDefault();
            navigate('/news');
            break;
          case 'KeyB': // Notice Board
            event.preventDefault();
            navigate('/notices');
            break;
          case 'KeyU': // Contact Us
            event.preventDefault();
            navigate('/contact');
            break;
          case 'Digit6': // Help / FAQ
            event.preventDefault();
            navigate('/faq');
            break;
          case 'KeyL': // Book Appointment
            event.preventDefault();
            navigate('/booking');
            break;
          case 'Digit1': // Legal Fee Calculator
            event.preventDefault();
            navigate('/calculator/legal-fee');
            break;
          case 'Digit2': // Other Calculators
            event.preventDefault();
            navigate('/calculator/other');
            break;
          case 'Digit3': // Research
            event.preventDefault();
            navigate('/research');
            break;

          // --- Feature & Font Shortcuts ---
          case 'KeyI': // Switch Language (EN/NP)
            event.preventDefault();
            setLanguage(language === 'en' ? 'np' : 'en');
            break;
          case 'Equal': // Increase Font Size
          case 'NumpadEqual':
            event.preventDefault();
            setFontSize(Math.min(200, fontSize + 10));
            break;
          case 'Minus': // Decrease Font Size
          case 'NumpadSubtract':
            event.preventDefault();
            setFontSize(Math.max(100, fontSize - 10));
            break;

          // --- Accessibility Toggle Shortcuts ---
          case 'KeyC': // Toggle High Contrast
            event.preventDefault();
            setHighContrast(!highContrast);
            break;
          case 'KeyJ': // Toggle Invert Colors
            event.preventDefault();
            setInvertMode(!invertMode);
            break;
          case 'KeyK': // Toggle Dyslexia Font
            event.preventDefault();
            setIsDyslexicFont(!isDyslexicFont);
            break;
          case 'KeyO': // Toggle Bold Text
            event.preventDefault();
            setIsBoldText(!isBoldText);
            break;
          case 'KeyF': // Toggle Underline Links
            event.preventDefault();
            setAreLinksUnderlined(!areLinksUnderlined);
            break;
          case 'KeyY': // Toggle Reading Ruler
            event.preventDefault();
            setReadingRuler(!readingRuler);
            break;
          case 'KeyE': // Toggle Reading Mask
            event.preventDefault();
            setReadingMask(!readingMask);
            break;
          case 'KeyP': // Toggle Pause Animations
            event.preventDefault();
            setReduceMotion(!reduceMotion);
            break;
          case 'KeyV': // Toggle Hover Read-Aloud
            event.preventDefault();
            setReadAloud(!readAloud);
            break;
          case 'KeyW': // Toggle Virtual Keyboard
            event.preventDefault();
            setVirtualKeyboard(!virtualKeyboard);
            break;
          case 'KeyQ': // Toggle Minimalist Mode
            event.preventDefault();
            setMinimalistMode(!minimalistMode);
            break;
          case 'Digit0': // Reset All Accessibility Settings
            event.preventDefault();
            resetAll();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    navigate,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    grayscaleMode,
    setGrayscaleMode,
    invertMode,
    setInvertMode,
    isDyslexicFont,
    setIsDyslexicFont,
    isBoldText,
    setIsBoldText,
    areLinksUnderlined,
    setAreLinksUnderlined,
    readingRuler,
    setReadingRuler,
    readingMask,
    setReadingMask,
    reduceMotion,
    setReduceMotion,
    readAloud,
    setReadAloud,
    virtualKeyboard,
    setVirtualKeyboard,
    minimalistMode,
    setMinimalistMode,
    resetAll,
  ]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
