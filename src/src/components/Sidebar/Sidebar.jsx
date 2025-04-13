import React from 'react';
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

export default function Sidebar({ 
  onSearch, 
  onFilterChange,
  onImportCsv,
  duplicatesCount = 0 
}) {
  return (
    <aside className="fixed left-0 w-1/5 h-full flex flex-col bg-sidebar-bg border-r border-sidebar-border">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Contacts</h1>
            <p className="text-sm text-gray-400">Manage your contacts</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search contacts..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
          <Users className="w-5 h-5" />
          <span>All People</span>
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
          <Briefcase className="w-5 h-5" />
          <span>Companies</span>
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
          <Star className="w-5 h-5" />
          <span>Favorites</span>
        </a>
      </nav>

      {/* Actions */}
      <div className="p-4 space-y-4">
        {/* Duplicates Box */}
        {duplicatesCount > 0 && (
          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>{duplicatesCount} possible duplicate{duplicatesCount === 1 ? '' : 's'}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button 
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            onClick={() => {/* TODO: Add new contact */}}
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>

          <input 
            type="file" 
            id="csvFileInput" 
            accept=".csv" 
            className="hidden" 
            onChange={onImportCsv}
          />
          <button 
            onClick={() => document.getElementById('csvFileInput').click()}
            className="w-full bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <button 
          className="w-full p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white flex items-center gap-3"
          onClick={() => {/* TODO: Show settings */}}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}