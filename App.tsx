
import React, { useState } from 'react';
import IndustrialHeader from './components/IndustrialHeader';
import MachineDashboard from './components/MachineDashboard';
import ArchitectureViewer from './components/ArchitectureViewer';
import LiveAssistant from './components/LiveAssistant';
import { DEFAULT_ARCHITECTURE, DEFAULT_SCHEMA, DEFAULT_API } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MachineDashboard />;
      case 'arch':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-white">System Architecture</h2>
                <p className="text-slate-400">Layered IoT stack for high-frequency data ingestion and PLC control.</p>
              </div>
              <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                Export Mermaid.js
              </button>
            </div>
            <ArchitectureViewer nodes={DEFAULT_ARCHITECTURE} />
          </div>
        );
      case 'db':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Database Schema</h2>
              <div className="space-y-4">
                {DEFAULT_SCHEMA.map(table => (
                  <div key={table.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-700/50 px-4 py-2 flex justify-between items-center">
                      <h3 className="font-mono font-bold text-blue-400">{table.name}</h3>
                      <span className="text-[10px] text-slate-400">POSTGRESQL</span>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="text-[10px] text-slate-500 uppercase">
                        <tr>
                          <th className="px-4 py-2">Field</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Constraints</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300 border-t border-slate-700">
                        {table.fields.map(field => (
                          <tr key={field.name} className="border-b border-slate-700/50 last:border-0">
                            <td className="px-4 py-2 font-mono">{field.name}</td>
                            <td className="px-4 py-2 text-slate-400">{field.type}</td>
                            <td className="px-4 py-2"><span className="text-orange-400 font-bold">{field.constraints}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Predictive Logic Ready</h3>
              <p className="text-slate-400">Your schema includes native support for TimescaleDB hypertables, enabling sub-millisecond querying of vibration and temperature datasets for LSTM-based failure prediction.</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Generate SQL Migration</button>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Core API Endpoints</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              {DEFAULT_API.map((api, idx) => (
                <div key={idx} className="p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold min-w-[60px] text-center ${
                      api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      api.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {api.method}
                    </span>
                    <code className="text-white font-mono text-sm">{api.path}</code>
                  </div>
                  <p className="text-slate-400 text-sm ml-[76px]">{api.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'assistant':
        return <LiveAssistant />;
      default:
        return <MachineDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <IndustrialHeader title="Smart Line Automation Planner" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>

      <footer className="p-8 border-t border-slate-900 text-center text-slate-500 text-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Industrial Intelligent Systems • Architecture Workbench</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Safety Protocols</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
