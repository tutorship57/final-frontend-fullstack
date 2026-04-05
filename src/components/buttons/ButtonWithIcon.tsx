import React from 'react';

interface ButtonWithIconProps {
  // Option 1: Standard Button style
  variant?: 'primary' | 'outline';
  onClick: () => void;
  text: string
  icon: string
}

const ButtonWithIcon = ({ onClick, variant = 'primary', text ,icon}: ButtonWithIconProps) => {
  // Styles for the main header button
  const primaryStyles = "bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-amber-900/20";
  
  // Styles if you wanted a different look elsewhere
  const outlineStyles = "border-2 border-dashed border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 w-full py-4 rounded-xl transition-colors";

  return (
    <button 
      onClick={onClick}
      className={variant === 'primary' ? primaryStyles : outlineStyles}
    >
      <span className="flex items-center gap-2">
        <span className="text-xl leading-none">{icon}</span>
        {text}  
      </span>
    </button>
  );
};

export default ButtonWithIcon;