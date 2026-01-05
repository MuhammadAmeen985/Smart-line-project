
import { ArchitectureNode, SchemaTable, ApiEndpoint } from './types';

export const DEFAULT_ARCHITECTURE: ArchitectureNode[] = [
  { id: 'iot_gateway', label: 'IoT Gateway', description: 'MQTT Broker (Mosquitto) / OPC-UA Server', type: 'edge', connections: ['backend_api'] },
  { id: 'plc', label: 'PLC / Modbus Sensors', description: 'Siemens S7 / Schneider Electric Hardware', type: 'edge', connections: ['iot_gateway'] },
  { id: 'backend_api', label: 'FastAPI Backend', description: 'Asynchronous Python Web Server', type: 'cloud', connections: ['postgres_db', 'timescale_db', 'frontend_app'] },
  { id: 'postgres_db', label: 'PostgreSQL', description: 'Relational Database for User/Assets', type: 'database', connections: [] },
  { id: 'timescale_db', label: 'TimescaleDB', description: 'Time-series Database for Sensor Logs', type: 'database', connections: [] },
  { id: 'frontend_app', label: 'React Dashboard', description: 'Industrial Monitoring UI', type: 'client', connections: [] },
];

export const DEFAULT_SCHEMA: SchemaTable[] = [
  {
    name: 'factories',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Unique identifier' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Factory name' },
      { name: 'location', type: 'POINT', description: 'Geolocation' }
    ]
  },
  {
    name: 'machines',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Asset identifier' },
      { name: 'factory_id', type: 'UUID', constraints: 'FK', description: 'Owner factory' },
      { name: 'model', type: 'VARCHAR(100)', description: 'Manufacturer model' },
      { name: 'threshold_temp', type: 'FLOAT', description: 'Critical temperature limit' }
    ]
  },
  {
    name: 'telemetry',
    fields: [
      { name: 'time', type: 'TIMESTAMPTZ', constraints: 'PK', description: 'Observation timestamp' },
      { name: 'machine_id', type: 'UUID', constraints: 'FK', description: 'Asset source' },
      { name: 'value', type: 'FLOAT', description: 'Sensor reading' },
      { name: 'metric_type', type: 'VARCHAR(50)', description: 'Temp/Vib/Load' }
    ]
  }
];

export const DEFAULT_API: ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/machines', description: 'List all industrial assets with status' },
  { method: 'POST', path: '/api/v1/machines/{id}/control', description: 'Send start/stop commands to PLC' },
  { method: 'GET', path: '/api/v1/analytics/energy', description: 'Aggregate energy consumption metrics' },
  { method: 'GET', path: '/api/v1/alerts/predictive', description: 'Fetch AI-predicted maintenance windows' },
];
