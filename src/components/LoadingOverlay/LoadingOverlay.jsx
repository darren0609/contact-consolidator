import React from 'react';
import { Loader2, ScanSearch } from 'lucide-react';

const LoadingOverlay = ({ message, progress, type = 'default' }) => {
  const LoadingIcon = type === 'analysis' ? ScanSearch : Loader2;
  
  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl 
                    flex flex-col items-center space-y-4">
        <LoadingIcon className={`w-8 h-8 text-blue-500 ${type === 'default' ? 'animate-spin' : 'animate-pulse'}`} />
        <p className="text-white text-center">{message}</p>
        {progress !== null && progress !== undefined && (
          <div className="w-64">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;