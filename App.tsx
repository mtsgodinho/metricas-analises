
import React, { useState, useCallback, useEffect } from 'react';
import { MetaMetric, AnalysisResult } from './types';
import { SAMPLE_DATA } from './constants';
import { analyzeMetrics } from './services/geminiService';
import Dashboard from './components/Dashboard';
import AIRecommendations from './components/AIRecommendations';

const App: React.FC = () => {
  const [data, setData] = useState<MetaMetric[]>(SAMPLE_DATA);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    // Fluxo de conexão simulado
    setLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
    }, 1500);
  };

  const handleRunAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMetrics(data);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao analisar métricas');
    } finally {
      setLoading(false);
    }
  }, [data]);

  const handleDataImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json) && json.length > 0) {
            setData(json);
            setAnalysis(null);
          }
        } catch (e) {
          setError("Formato de arquivo JSON inválido. Use os dados de exportação do Meta.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">MetaMetrics <span className="text-indigo-600">AI</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Conectado: BM_Empresa_Exemplo
              </div>
            )}
            <button 
              onClick={handleConnect}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${isConnected ? 'bg-gray-100 text-gray-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              disabled={loading}
            >
              {isConnected ? 'Desconectar' : 'Conectar BM do Meta'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Desbloqueie insights profundos dos seus <br/> <span className="text-indigo-600">anúncios do Meta</span>
              </h2>
              <p className="text-lg text-gray-600">
                Conecte seu Business Manager ou envie um arquivo de exportação para obter recomendações de IA para escalar seu ROAS e reduzir o CPA.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={handleConnect}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-600 transition-all space-y-3 group shadow-sm"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </div>
                <span className="font-bold text-gray-900">OAuth Oficial</span>
                <span className="text-xs text-gray-500">Sincronização rápida e segura</span>
              </button>

              <label className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-600 transition-all space-y-3 group shadow-sm cursor-pointer">
                <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <span className="font-bold text-gray-900">Upload de JSON</span>
                <span className="text-xs text-gray-500">Exportação manual de dados</span>
                <input type="file" className="hidden" accept=".json" onChange={handleDataImport} />
              </label>
            </div>
            
            <p className="text-sm text-gray-400">
              Confiado por gestores de tráfego e agências de performance em todo o mundo.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Visão Geral de Performance</h2>
                <p className="text-gray-500">Métricas em tempo real da sua conta de anúncios principal.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRunAnalysis}
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {analysis ? 'Refazer Análise' : 'Analisar com IA'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-md">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span className="font-semibold">Erro:</span> {error}
                </div>
              </div>
            )}

            <Dashboard data={data} />

            {(analysis || loading) && (
              <AIRecommendations result={analysis || { summary: '', recommendations: [], score: 0 }} isLoading={loading} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">© 2024 MetaMetrics AI. Assistente Profissional de Tráfego Pago.</p>
      </footer>
    </div>
  );
};

export default App;
