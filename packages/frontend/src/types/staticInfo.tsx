interface DeviceInfo {
	device_name: string;
	os: string;
	public_ip: string;
	uptime: {
		days: number;
		hours: number;
		minutes: number;
	};
	cpu_info: {
		cpu_cores: number;
		cpu_usage: number;
	};
	memory_info: {
		total_memory: number;
		used_memory: number;
		available_memory: number;
	};
}

interface ActiveConnection {
	pid: string | number;
	protocol: string;
	local_address: string;
	remote_address: string;
	status: string;
	process_name: string;
}

interface InterfaceInfo {
	interface: string;
	status: string;
	addresses: {
		type: string;
		address: string;
	}[];
	mtu: string;
}

interface NetworkUsage {
	time_of_report: string;
	bytes_sent: number;
	bytes_received: number;
	packets_sent: number;
	packets_received: number;
}

interface RunningProcess {
	pid: number;
	process_name: string;
	exe: string;
	app_name: string;
}

interface OpenPort {
	port: number;
	pid: number;
	process_name: string;
}

interface DomainMapping {
	process_name: string;
	domains: {
		domain: string;
		timestamp: string;
	}[];
}

interface ApplicationData {
	process: string;
	name: string;
	pid: number;
	path: string;
	uptime: string;
	total_bytes_sent: number;
	total_bytes_received: number;
}

interface ClientData {
	clientID: string;
	device_info: DeviceInfo;
	active_connections: ActiveConnection[];
	network_interfaces: InterfaceInfo[];
	network_usage: NetworkUsage;
	running_processes: RunningProcess[];
	open_ports: OpenPort[];
	domain_mapping: DomainMapping[];
	application_data: ApplicationData[];
	last_ping: Date;
}
