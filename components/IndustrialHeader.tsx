
import React from 'react';

interface Props {
  title: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const IndustrialHeader: React.FC<Props> = ({ title, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Monitor' },
    { id: 'arch', label: 'Architecture' },
    { id: 'db', label: 'Database' },
    { id: 'api', label: 'APIs' },
    { id: 'assistant', label: 'AI Engineer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 p-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-xs text-slate-400 font-mono">SME_AUTO_ARCH_v2.0.4</p>
          </div>
        </div>

        <nav className="flex bg-slate-800 rounded-full p-1 border border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default IndustrialHeader;
