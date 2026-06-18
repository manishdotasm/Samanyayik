import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  const { highContrast } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.getElementById('root')?.setAttribute('aria-hidden', 'true');
      
      // Focus the first focusable element inside the modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.getElementById('root')?.removeAttribute('aria-hidden');
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstEl = focusableElements[0] as HTMLElement;
        const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-white text-black'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 z-10 ${highContrast ? 'bg-black' : 'bg-white'}`}>
          {title && <h2 className="text-2xl font-serif font-bold pr-8">{title}</h2>}
          <button 
            onClick={onClose}
            className={`p-3 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 ${highContrast ? 'text-yellow-400 hover:bg-gray-800 focus:ring-yellow-400' : 'text-gray-500 focus:ring-secondary'}`}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};