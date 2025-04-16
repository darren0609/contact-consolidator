import React from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphabetSpeedDial({ letters = [], onLetterSelect }) {
  if (!letters || letters.length === 0) return null;

  return (
    <div className="sticky top-0 bg-gray-900 z-10 py-2 border-b border-gray-700">
      <div className="flex justify-center gap-1">
        {ALPHABET.map(letter => (
          <button
            key={letter}
            onClick={() => onLetterSelect(letter)}
            className={`
              w-8 h-8 text-xs rounded-full 
              ${letters.includes(letter) 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
              transition-colors
            `}
            disabled={!letters.includes(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}