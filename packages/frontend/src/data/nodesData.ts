export interface Node {
  id: number;
  deviceName: string;
  ip: string;
  platform: string;
  status: string;
  lastPing: string;
  anomaliesDetected: string;
}

const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

export const nodes = [
  {
    id: "NODE001",
    deviceName: "Device 1",
    ip: "192.168.1.1",
    platform: "Linux",
    status: "active",
    lastPing: "2024-09-10 10:45:00",
    anomaliesDetected: 2,
  },
  {
    id: "NODE002",
    deviceName: "Device 2",
    ip: "192.168.1.2",
    platform: "Windows",
    status: "inactive",
    lastPing: "2024-09-10 11:00:00",
    anomaliesDetected: 5,
  },
  {
    id: "NODE003",
    deviceName: "Device 3",
    ip: "192.168.1.3",
    platform: "Linux",
    status: "disconnected",
    lastPing: "2024-09-10 11:30:00",
    anomaliesDetected: 0,
  },
  {
    id: "NODE004",
    deviceName: "Device 4",
    ip: "192.168.1.4",
    platform: "Linux",
    status: "active",
    lastPing: "2024-09-10 12:00:00",
    anomaliesDetected: 1,
  },
  {
    id: "NODE005",
    deviceName: "Device 5",
    ip: "192.168.1.5",
    platform: "Windows",
    status: "inactive",
    lastPing: "2024-09-10 12:30:00",
    anomaliesDetected: 3,
  },
];
