import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Upload, 
  Settings, 
  Star, 
  Briefcase, 
  AlertCircle,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { SpeedDial, SpeedDialIcon } from '../SpeedDial/SpeedDial';
import { SourceLegend } from '../SourceIndicator';
import SearchBar from '../SearchBar';

export default function Sidebar({ 
  onSearch, 
  onImportCsv, 
  duplicateCount = 0,
  onToggleDuplicates,
  showDuplicates
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event) => {
    try {
      setIsImporting(true);
      await onImportCsv(event);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <aside className="h-full w-64 flex flex-col bg-gray-800 border-r border-gray-700">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Contacts</h1>
              <p className="text-sm text-gray-400">Manage your contacts</p>
            </div>
          </div>
          
          {/* Source Legend - Now in top right */}
          <div className="flex-shrink-0">
            <SourceLegend />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <SearchBar 
            value={searchTerm} 
            onChange={(value) => {
              setSearchTerm(value);
              onSearch(value);
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white">
            <Users className="w-5 h-5" />
            <span>All Contacts</span>
          </a>

          {duplicateCount > 0 && (
            <button
              onClick={onToggleDuplicates}
              className={`flex items-center justify-between w-full p-2 rounded-lg 
                        transition-colors ${showDuplicates 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Potential Duplicates</span>
              </div>
              <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
                {duplicateCount}
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Action Menu at bottom */}
      <div className="flex-shrink-0 border-t border-gray-700 p-4">
        <SpeedDial>
          <SpeedDialIcon 
            onClick={() => {/* TODO: Add new contact */}} 
            icon="plus" 
            label="New Contact" 
          />
          <SpeedDialIcon 
            onClick={() => document.getElementById('csvFileInput').click()} 
            icon="upload" 
            label={isImporting ? "Importing..." : "Import"}
            disabled={isImporting}
          />
          <SpeedDialIcon 
            onClick={() => {/* TODO: Export */}} 
            icon="download" 
            label="Export" 
          />
          <SpeedDialIcon 
            onClick={() => {/* TODO: Settings */}} 
            icon="settings" 
            label="Settings" 
          />
        </SpeedDial>
        <input 
          type="file" 
          id="csvFileInput" 
          accept=".csv" 
          className="hidden" 
          onChange={handleImport}
          disabled={isImporting}
        />
      </div>
    </aside>
  );
}