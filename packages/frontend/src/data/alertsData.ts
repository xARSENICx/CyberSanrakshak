// alertsData.ts
export interface Alert {
	nodeid: string;
	deviceName: string;
	ip: string;
	platform: string;
	status: string;
	lastPing: string;
	alert: string;
	description: string;
}

export const alerts: Alert[] = [
	{
		nodeid: "1",
		deviceName: "Device A",
		ip: "192.168.0.1",
		platform: "Linux",
		status: "active",
		lastPing: "2024-12-07T10:15:00Z",
		alert: "High CPU usage",
		description: "CPU usage exceeded 90% for 5 minutes",
	},
	{
		nodeid: "2",
		deviceName: "Device B",
		ip: "192.168.0.2",
		platform: "Windows",
		status: "inactive",
		lastPing: "2024-12-06T15:30:00Z",
		alert: "Disk space low",
		description: "Available disk space below 5%",
	},
	{
		nodeid: "3",
		deviceName: "Device C",
		ip: "192.168.0.3",
		platform: "macOS",
		status: "active",
		lastPing: "2024-12-07T11:45:00Z",
		alert: "Network anomaly detected",
		description: "Unusual network traffic pattern",
	},
	{
		nodeid: "4",
		deviceName: "Device D",
		ip: "192.168.0.4",
		platform: "Linux",
		status: "warning",
		lastPing: "2024-12-07T09:00:00Z",
		alert: "Temperature threshold exceeded",
		description: "Device temperature above 80°C",
	},
];
