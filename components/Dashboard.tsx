
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MetaMetric } from '../types';
import MetricCard from './MetricCard';

interface DashboardProps {
  data: MetaMetric[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  const calculateTrend = (curr: number, prev: number) => {
    if (!prev) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const totals = data.reduce((acc, curr) => ({
    spend: acc.spend + curr.spend,
    revenue: acc.revenue + curr.revenue,
    conversions: acc.conversions + curr.conversions,
    clicks: acc.clicks + curr.clicks,
  }), { spend: 0, revenue: 0, conversions: 0, clicks: 0 });

  const avgRoas = totals.revenue / totals.spend;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Gasto Total" 
          value={`R$${totals.spend.toLocaleString('pt-BR')}`} 
          trend={calculateTrend(latest.spend, previous.spend)}
        />
        <MetricCard 
          label="ROAS Médio" 
          value={avgRoas.toFixed(2)} 
          trend={calculateTrend(latest.roas, previous.roas)}
          suffix="x"
        />
        <MetricCard 
          label="Conversões" 
          value={totals.conversions} 
          trend={calculateTrend(latest.conversions, previous.conversions)}
        />
        <MetricCard 
          label="CPC Médio" 
          value={`R$${(totals.spend / totals.clicks).toFixed(2)}`}
          trend={calculateTrend(latest.cpc, previous.cpc)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6">Receita vs Gasto ao Longo do Tempo</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any, name: any) => [name === 'revenue' ? `R$ ${value}` : `R$ ${value}`, name === 'revenue' ? 'Receita' : 'Gasto']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} name="Receita" />
                <Area type="monotone" dataKey="spend" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} name="Gasto" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6">Métricas de Performance</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" verticalAlign="top" align="right" height={36}/>
                <Bar dataKey="roas" fill="#4f46e5" radius={[4, 4, 0, 0]} name="ROAS" />
                <Bar dataKey="ctr" fill="#10b981" radius={[4, 4, 0, 0]} name="CTR %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
