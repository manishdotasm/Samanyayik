import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  'aria-label'?: string;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  to,
  href,
  disabled,
  ...props
}) => {
  const { highContrast } = useAccessibility();

  let baseStyles = "px-6 py-3 font-bold transition-all duration-300 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center gap-2";
  
  if (disabled) {
    baseStyles += " opacity-50 cursor-not-allowed";
  } else {
    baseStyles += " active:scale-[0.98]";
  }

  let variantStyles = "";

  if (variant === 'primary') {
    variantStyles = highContrast 
      ? "bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black focus:ring-yellow-400"
      : "bg-secondary text-white hover:bg-green-900 focus:bg-green-900 focus:ring-green-500";
  } else if (variant === 'secondary') {
    variantStyles = highContrast
      ? "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black focus:bg-white focus:text-black focus:ring-white"
      : "bg-gray-100 text-secondary hover:bg-gray-200 focus:bg-gray-200 focus:ring-gray-400";
  } else if (variant === 'outline') {
    variantStyles = highContrast
       ? "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black focus:ring-yellow-400"
       : "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white focus:ring-green-500";
  }

  const combinedClasses = `${baseStyles} ${variantStyles} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={combinedClasses} {...(props as any)}>
        {children}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={combinedClasses} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...(props as any)}>
      {children}
    </button>
  );
};