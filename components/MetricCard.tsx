
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, suffix = "" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}{suffix}</h3>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
