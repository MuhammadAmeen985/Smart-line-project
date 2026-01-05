
import React from 'react';
import { ArchitectureNode } from '../types';

interface Props {
  nodes: ArchitectureNode[];
}

// Moved outside to avoid re-creation on every render and typed as React.FC to properly handle standard props like 'key'
const NodeCard: React.FC<{ node: ArchitectureNode }> = ({ node }) => (
  <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-lg hover:ring-2 hover:ring-blue-500/50 transition-all cursor-default">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-2 h-2 rounded-full ${
        node.type === 'edge' ? 'bg-orange-500' :
        node.type === 'cloud' ? 'bg-blue-500' :
        node.type === 'database' ? 'bg-purple-500' : 'bg-green-500'
      }`} />
      <h4 className="font-bold text-sm text-white">{node.label}</h4>
    </div>
    <p className="text-xs text-slate-400 mb-2">{node.description}</p>
    {node.connections.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-auto">
        {node.connections.map(c => (
          <span key={c} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            → {c}
          </span>
        ))}
      </div>
    )}
  </div>
);

const ArchitectureViewer: React.FC<Props> = ({ nodes }) => {
  const groups = {
    edge: nodes.filter(n => n.type === 'edge'),
    cloud: nodes.filter(n => n.type === 'cloud'),
    database: nodes.filter(n => n.type === 'database'),
    client: nodes.filter(n => n.type === 'client'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Edge Layer</h3>
        {groups.edge.map(n => <NodeCard key={n.id} node={n} />)}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Cloud Services</h3>
        {groups.cloud.map(n => <NodeCard key={n.id} node={n} />)}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Storage</h3>
        {groups.database.map(n => <NodeCard key={n.id} node={n} />)}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Client</h3>
        {groups.client.map(n => <NodeCard key={n.id} node={n} />)}
      </div>
    </div>
  );
};

export default ArchitectureViewer;
