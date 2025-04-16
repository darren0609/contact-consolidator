import { FileSpreadsheet, Mail } from 'lucide-react';

const sourceConfig = {
  'csv': {
    color: 'bg-blue-500',
    icon: FileSpreadsheet,
    label: 'CSV Import'
  },
  'gmail': {
    color: 'bg-red-500',
    icon: Mail,
    label: 'Gmail'
  },
  'yahoo': {
    color: 'bg-purple-500',
    icon: Mail,
    label: 'Yahoo'
  }
};

export const SourceIndicator = ({ source }) => {
  const config = sourceConfig[source] || sourceConfig.csv;
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <config.icon className="w-4 h-4 text-gray-400" />
      <span className="text-xs text-gray-400">{config.label}</span>
    </div>
  );
};

export const SourceLegend = () => {
  return (
    <div className="p-4 space-y-2">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Sources</h4>
      {Object.entries(sourceConfig).map(([key, config]) => (
        <div key={key} className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          <config.icon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">{config.label}</span>
        </div>
      ))}
    </div>
  );
};