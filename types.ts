
export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  type: 'edge' | 'cloud' | 'client' | 'database';
  connections: string[];
}

export interface SchemaField {
  name: string;
  type: string;
  constraints?: string;
  description: string;
}

export interface SchemaTable {
  name: string;
  fields: SchemaField[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params?: string[];
}

export interface MachineStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  load: number;
  temperature: number;
  vibration: number;
  lastUpdate: string;
}
