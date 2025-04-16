import React, { useState } from 'react';
import { Plus, Upload, Download, Settings, X } from 'lucide-react';

export const SpeedDial = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChildClick = (callback) => {
    return (...args) => {
      callback?.(...args);
      setIsOpen(false);
    };
  };

  const childrenWithClose = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: handleChildClick(child.props.onClick)
      });
    }
    return child;
  });

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-all duration-200 ease-in-out
          ${isOpen 
            ? 'bg-gray-700 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      <div 
        className={`absolute bottom-full left-0 mb-2 transition-all duration-200 ease-in-out
          ${isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible translate-y-2'}`}
      >
        <div className="flex flex-col items-start space-y-2">
          {childrenWithClose}
        </div>
      </div>
    </div>
  );
};

export const SpeedDialIcon = ({ onClick, icon, label, disabled = false }) => {
  const Icon = {
    upload: Upload,
    download: Download,
    settings: Settings,
    plus: Plus
  }[icon] || Plus;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg 
        whitespace-nowrap w-full transition-all duration-200
        ${disabled 
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
          : 'bg-gray-800 text-white hover:bg-gray-700'}
      `}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
};