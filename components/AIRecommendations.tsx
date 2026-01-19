
import React from 'react';
import { AnalysisResult } from '../types';

interface AIRecommendationsProps {
  result: AnalysisResult;
  isLoading: boolean;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse font-medium">O Gemini está analisando seus dados...</p>
      </div>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
      case 'alto': return 'bg-red-100 text-red-700';
      case 'medium':
      case 'médio': return 'bg-yellow-100 text-yellow-700';
      case 'low':
      case 'baixo': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const translateImpact = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'Alto';
      case 'medium': return 'Médio';
      case 'low': return 'Baixo';
      default: return impact;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Resumo de Otimização</h2>
            <p className="text-indigo-100 max-w-2xl">{result.summary}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black">{result.score}%</div>
            <div className="text-xs uppercase tracking-widest text-indigo-200">Score de Saúde</div>
          </div>
        </div>
        {/* Decorator circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${getImpactColor(rec.impact)}`}>
                Impacto {translateImpact(rec.impact)}
              </span>
              <span className="text-xs font-medium text-gray-400">#{rec.type}</span>
            </div>
            <h5 className="font-bold text-gray-900 mb-2">{rec.title}</h5>
            <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
            <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
              <span className="text-[10px] text-gray-400 block mb-1 uppercase font-bold">Ação Recomendada</span>
              <p className="text-sm font-semibold text-indigo-700">{rec.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
