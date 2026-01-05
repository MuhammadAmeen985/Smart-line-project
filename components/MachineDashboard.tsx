
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MachineStatus } from '../types';

const generateMockData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    load: Math.floor(Math.random() * 40) + 60,
    temp: Math.floor(Math.random() * 20) + 40,
    energy: Math.floor(Math.random() * 100) + 200,
  }));
};

const MachineDashboard: React.FC = () => {
  const [data, setData] = useState(generateMockData());
  const [machines] = useState<MachineStatus[]>([
    { id: 'm1', name: 'CNC Lathe 01', status: 'ONLINE', load: 85, temperature: 42, vibration: 0.12, lastUpdate: 'Just now' },
    { id: 'm2', name: 'Hydraulic Press', status: 'ONLINE', load: 45, temperature: 38, vibration: 0.85, lastUpdate: '2m ago' },
    { id: 'm3', name: 'Injection Molder', status: 'MAINTENANCE', load: 0, temperature: 22, vibration: 0.0, lastUpdate: '1h ago' },
    { id: 'm4', name: 'Air Compressor', status: 'ONLINE', load: 92, temperature: 55, vibration: 0.45, lastUpdate: 'Just now' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          load: Math.floor(Math.random() * 40) + 60,
          temp: Math.floor(Math.random() * 20) + 40,
          energy: Math.floor(Math.random() * 100) + 200,
        }];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map(m => (
          <div key={m.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-slate-100">{m.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                m.status === 'ONLINE' ? 'bg-green-500/20 text-green-400' : 
                m.status === 'MAINTENANCE' ? 'bg-orange-500/20 text-orange-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {m.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Load</span>
                <span className="text-white font-mono">{m.load}%</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${m.load}%` }}></div>
              </div>
              <div className="flex justify-between text-slate-400 mt-2">
                <span>Temp</span>
                <span className={`${m.temperature > 50 ? 'text-red-400' : 'text-slate-100'} font-mono`}>{m.temperature}°C</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Line Production Efficiency</h3>
            <span className="text-xs font-mono text-slate-500">REALTIME TELEMETRY</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Energy Consumption (kW/h)</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-xs text-slate-400">Aggregated Load</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Line type="stepAfter" dataKey="energy" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDashboard;
