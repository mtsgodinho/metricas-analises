
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MetaMetric, AnalysisResult, AdAccount, MetaConnection } from './types.ts';
import { SAMPLE_DATA } from './constants.tsx';
import { analyzeMetrics } from './services/geminiService.ts';
import { fetchAdAccounts, fetchAdAccountInsights } from './services/metaService.ts';

// Componente Interno: MetricCard
const MetricCard = ({ label, value, trend, suffix = "" }: any) => (
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

// Componente Interno: Dashboard
const Dashboard = ({ data }: { data: MetaMetric[] }) => {
  const latest = (data[data.length - 1] || {}) as MetaMetric;
  const previous = (data[data.length - 2] || {}) as MetaMetric;
  const calculateTrend = (curr: number, prev: number) => prev ? Math.round(((curr - prev) / prev) * 100) : 0;

  const totals = data.reduce((acc, curr) => ({
    spend: acc.spend + (curr.spend || 0),
    revenue: acc.revenue + (curr.revenue || 0),
    conversions: acc.conversions + (curr.conversions || 0),
    clicks: acc.clicks + (curr.clicks || 0),
  }), { spend: 0, revenue: 0, conversions: 0, clicks: 0 });

  const roasTotal = totals.spend > 0 ? (totals.revenue / totals.spend) : 0;
  const cpcTotal = totals.clicks > 0 ? (totals.spend / totals.clicks) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Gasto Total" value={`R$${totals.spend.toLocaleString('pt-BR')}`} trend={calculateTrend(latest.spend || 0, previous.spend || 0)} />
        <MetricCard label="ROAS Médio" value={roasTotal.toFixed(2)} trend={calculateTrend(latest.roas || 0, previous.roas || 0)} suffix="x" />
        <MetricCard label="Conversões" value={totals.conversions} trend={calculateTrend(latest.conversions || 0, previous.conversions || 0)} />
        <MetricCard label="CPC Médio" value={`R$${cpcTotal.toFixed(2)}`} trend={calculateTrend(latest.cpc || 0, previous.cpc || 0)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6">Receita vs Gasto</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#4f46e520" name="Receita" />
                <Area type="monotone" dataKey="spend" stroke="#ef4444" fill="#ef444420" name="Gasto" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6">Métricas de Saúde</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="roas" fill="#4f46e5" name="ROAS" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ctr" fill="#10b981" name="CTR %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Interno: AIRecommendations
const AIRecommendations = ({ result, isLoading }: { result: AnalysisResult; isLoading: boolean }) => {
  if (isLoading) return (
    <div className="bg-white p-12 rounded-xl border border-dashed border-indigo-200 text-center animate-pulse">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-indigo-600 font-bold text-lg">IA analisando métricas do Meta...</p>
      <p className="text-gray-400 text-sm mt-1">Isso pode levar alguns segundos.</p>
    </div>
  );
  if (!result || !result.summary) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.8 1.451l-2.1 3.5a1 1 0 01-1.314.351L6.447 5.033l-3.561 3.56a1 1 0 11-1.414-1.414l4-4a1 1 0 011.23-.153l2.239 1.343L10.3 2.047a1 1 0 011-1z" clipRule="evenodd" /><path d="M8 11a1 1 0 011-1h5a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
              Insights Estratégicos
            </h2>
            <p className="text-indigo-50 text-lg leading-relaxed">{result.summary}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center border border-white/20 min-w-[140px]">
            <div className="text-5xl font-black">{result.score}%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">Score de Saúde</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.recommendations.map((rec, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                (rec.impact as string) === 'high' || (rec.impact as string) === 'alto' ? 'bg-red-50 text-red-600' :
                (rec.impact as string) === 'medium' || (rec.impact as string) === 'médio' ? 'bg-amber-50 text-amber-600' : 
                'bg-blue-50 text-blue-600'
              }`}>
                Impacto {rec.impact}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">#{rec.type}</span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{rec.title}</h4>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{rec.description}</p>
            <div className="bg-indigo-50/50 p-4 rounded-xl border-l-4 border-indigo-600">
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-tighter">Plano de Ação</p>
              <p className="text-sm font-bold text-indigo-900">{rec.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<MetaMetric[]>(SAMPLE_DATA);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connection, setConnection] = useState<MetaConnection | null>(null);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Inputs do Modal
  const [tempToken, setTempToken] = useState('');

  const handleFetchAccounts = async () => {
    if (!tempToken) return;
    setLoading(true);
    setError(null);
    try {
      const accounts = await fetchAdAccounts(tempToken);
      setAdAccounts(accounts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (account: AdAccount) => {
    setLoading(true);
    setError(null);
    try {
      const insights = await fetchAdAccountInsights(tempToken, account.id);
      setData(insights);
      setConnection({
        accessToken: tempToken,
        adAccountId: account.id,
        accountName: account.name
      });
      setShowConnectModal(false);
      setAnalysis(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMetrics(data);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError("Falha na análise: Certifique-se de que a chave de API está configurada corretamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnection(null);
    setData(SAMPLE_DATA);
    setAnalysis(null);
    setAdAccounts([]);
    setTempToken('');
  };

  return (
    <div className="min-h-screen bg-[#fafbff] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <span>MetaMetrics <span className="text-indigo-600 italic">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
           {connection && <span className="hidden sm:inline text-xs font-bold text-green-500 uppercase tracking-widest">Ativo: {connection.accountName}</span>}
           <button 
            onClick={() => connection ? handleDisconnect() : setShowConnectModal(true)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              connection 
                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                : 'bg-gray-900 text-white hover:bg-indigo-600 shadow-xl shadow-gray-200'
            }`}
          >
            {connection ? 'Desconectar Meta' : 'Conectar Meta BM'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {!connection && !analysis && (
          <div className="text-center py-20 max-w-3xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Powered by Gemini 2.0
              </div>
              <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-[0.9]">
                Pare de Chutar seu <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tráfego Pago.</span>
              </h1>
              <p className="text-gray-500 text-xl font-medium max-w-xl mx-auto">
                Conecte seu Gerenciador de Anúncios e deixe nossa IA identificar gargalos ocultos nos seus criativos e segmentações.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => setShowConnectModal(true)} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95">
                Conectar e Analisar Agora
              </button>
              <div className="flex justify-center items-center gap-6 opacity-40 grayscale pointer-events-none">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" className="h-6" alt="Meta" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" className="h-6" alt="Gemini" />
              </div>
            </div>
          </div>
        )}

        {(connection || analysis) && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
                  {connection ? `Conta: ${connection.accountName}` : 'Dados de Exemplo'}
                </h2>
                <p className="text-gray-400 font-medium">Visualizando performance dos últimos 7 dias.</p>
              </div>
              <button 
                onClick={handleRunAnalysis} 
                disabled={loading}
                className="group w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 disabled:opacity-50 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
              >
                {loading ? 'Analisando...' : (
                  <>
                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.8 1.451l-2.1 3.5a1 1 0 01-1.314.351L6.447 5.033l-3.561 3.56a1 1 0 11-1.414-1.414l4-4a1 1 0 011.23-.153l2.239 1.343L10.3 2.047a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Gerar Insights com IA
                  </>
                )}
              </button>
            </div>

            {error && <div className="p-5 bg-red-50 text-red-700 border border-red-100 rounded-2xl font-bold flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>}

            <Dashboard data={data} />
            
            <AIRecommendations 
              result={analysis || { summary: '', recommendations: [], score: 0 }} 
              isLoading={loading} 
            />
          </div>
        )}
      </main>

      {/* Modal de Conexão */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Conectar ao Meta Ads</h3>
                <p className="text-gray-400 text-sm font-medium">Use seu Token de Acesso para sincronizar.</p>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Token de Acesso (User Token)</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={tempToken}
                    onChange={(e) => setTempToken(e.target.value)}
                    placeholder="EAA..." 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-mono text-sm"
                  />
                  {tempToken && (
                    <button 
                      onClick={handleFetchAccounts}
                      disabled={loading}
                      className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Buscando...' : 'Listar Contas'}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 italic">Você pode gerar um token temporário no <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="text-indigo-600 underline">Graph API Explorer</a>.</p>
              </div>

              {adAccounts.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                   <label className="text-xs font-black uppercase tracking-widest text-gray-400">Selecione sua Conta de Anúncios</label>
                   <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                     {adAccounts.map((acc) => (
                       <button 
                        key={acc.id}
                        onClick={() => handleSelectAccount(acc)}
                        className="w-full p-4 rounded-2xl border border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 text-left transition-all flex justify-between items-center group"
                       >
                         <div>
                            <p className="font-bold text-gray-900 group-hover:text-indigo-900">{acc.name}</p>
                            <p className="text-[10px] text-gray-400">ID: {acc.id}</p>
                         </div>
                         <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
            </div>

            <div className="p-8 bg-gray-50 flex gap-4">
              <button onClick={() => setShowConnectModal(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm font-medium">© 2024 MetaMetrics AI Optimizer. Assistente Profissional de Tráfego Pago.</p>
      </footer>
    </div>
  );
};

export default App;
