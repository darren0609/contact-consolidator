import React from 'react';
import { AlertTriangle, Users, X } from 'lucide-react';

const DuplicatesList = ({ duplicateGroups = new Map(), onMergeSelect, onDismissMatch }) => {
  if (!duplicateGroups || duplicateGroups.size === 0) {
    return (
      <div className="text-center p-4 text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-2" />
        <p>No duplicate contacts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">
        Potential Duplicates ({duplicateGroups.size})
      </h2>
      {Array.from(duplicateGroups).map(([primary, matches], groupIndex) => (
        <div 
          key={groupIndex}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-white font-medium">
                {primary.first_name} {primary.last_name}
              </h3>
            </div>
            <span className="text-sm text-gray-400">
              {matches.length} potential {matches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          <div className="space-y-2">
            {matches.map((match, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between bg-gray-700/50 rounded p-3"
              >
                <div>
                  <p className="text-white">
                    {match.contact.first_name} {match.contact.last_name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Confidence: {Math.round(match.confidence * 100)}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDismissMatch(primary, match.contact)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md 
                             hover:bg-gray-500 transition-colors"
                    title="Dismiss match"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMergeSelect(primary, match.contact)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md 
                             hover:bg-blue-700 transition-colors"
                  >
                    Review & Merge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DuplicatesList;