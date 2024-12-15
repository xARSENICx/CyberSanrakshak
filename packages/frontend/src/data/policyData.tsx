import { ColumnDef } from "@tanstack/react-table";
interface Policy {
	id: string;
	policyName: string;
	domain: string;
	application: string;
	protocol: string[];
	ip: string;
	port: number;
	direction: "in" | "out";
	scheduleStart: string;
	scheduleEnd: string;
}
export const PolicyColumns: ColumnDef<Policy>[] = [
	{
		accessorKey: "id",
		header: "Policy Id",
	},
	{
		accessorKey: "policyName",
		header: "App Name",
	},
	{
		accessorKey: "domain",
		header: "Domain",
	},
	{
		accessorKey: "application",
		header: "Application",
	},
	{
		accessorKey: "protocol",
		header: "Protocol",
		cell: ({ row }) => {
			return (
				<div>
					{row.getValue("protocol").map((protocol: string, index: number) => (
						<div key={index}>{protocol}</div>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "ip",
		header: "IP",
	},
	{
		accessorKey: "port",
		header: "Port",
	},
	{
		accessorKey: "direction",
		header: "Direction",
		cell: ({ row }) => {
			const direction = row.getValue("direction");
			return (
				<div
					className={`font-medium w-fit px-4 py-2 rounded-lg ${
						direction === "in" ? "bg-blue-200" : "bg-yellow-200"
					}`}>
					{direction}
				</div>
			);
		},
	},
	{
		accessorKey: "scheduleStart",
		header: "Schedule Start",
	},
	{
		accessorKey: "scheduleEnd",
		header: "Schedule End",
	},
];

export const policies: Policy[] = [
	{
		id: "POL001",
		policyName: "Chrome",
		domain: "example.com",
		application: "Browser",
		protocol: ["HTTP", "HTTPS"],
		ip: "192.168.1.1",
		port: 80,
		direction: "in",
		scheduleStart: "2024-01-01 09:00",
		scheduleEnd: "2024-01-01 17:00",
	},
	{
		id: "POL002",
		policyName: "Brave",
		domain: "example.org",
		application: "Browser",
		protocol: ["HTTP", "HTTPS"],
		ip: "192.168.1.2",
		port: 443,
		direction: "out",
		scheduleStart: "2024-02-01 10:00",
		scheduleEnd: "2024-02-01 18:00",
	},
	{
		id: "POL003",
		policyName: "Slack",
		domain: "slack.com",
		application: "Messaging",
		protocol: ["TCP"],
		ip: "192.168.1.3",
		port: 5222,
		direction: "in",
		scheduleStart: "2024-03-01 08:00",
		scheduleEnd: "2024-03-01 16:00",
	},
	{
		id: "POL004",
		policyName: "Zoom",
		domain: "zoom.us",
		application: "Video Conferencing",
		protocol: ["UDP"],
		ip: "192.168.1.4",
		port: 8800,
		direction: "out",
		scheduleStart: "2024-04-01 09:30",
		scheduleEnd: "2024-04-01 15:30",
	},
	{
		id: "POL005",
		policyName: "GitHub",
		domain: "github.com",
		application: "Development",
		protocol: ["HTTPS"],
		ip: "192.168.1.5",
		port: 443,
		direction: "in",
		scheduleStart: "2024-05-01 07:00",
		scheduleEnd: "2024-05-01 19:00",
	},
	{
		id: "POL006",
		policyName: "Netflix",
		domain: "netflix.com",
		application: "Streaming",
		protocol: ["TCP", "UDP"],
		ip: "192.168.1.6",
		port: 8080,
		direction: "out",
		scheduleStart: "2024-06-01 12:00",
		scheduleEnd: "2024-06-01 22:00",
	},
	{
		id: "POL007",
		policyName: "Zoom",
		domain: "zoom.us",
		application: "Video Conferencing",
		protocol: ["UDP", "TCP"],
		ip: "192.168.1.7",
		port: 443,
		direction: "in",
		scheduleStart: "2024-07-01 11:00",
		scheduleEnd: "2024-07-01 20:00",
	},
	{
		id: "POL008",
		policyName: "Discord",
		domain: "discord.com",
		application: "Messaging",
		protocol: ["TCP", "UDP"],
		ip: "192.168.1.8",
		port: 3000,
		direction: "out",
		scheduleStart: "2024-08-01 14:00",
		scheduleEnd: "2024-08-01 23:00",
	},
	{
		id: "POL009",
		policyName: "Twitch",
		domain: "twitch.tv",
		application: "Streaming",
		protocol: ["HTTP", "HTTPS"],
		ip: "192.168.1.9",
		port: 80,
		direction: "in",
		scheduleStart: "2024-09-01 08:30",
		scheduleEnd: "2024-09-01 18:30",
	},
	{
		id: "POL010",
		policyName: "Spotify",
		domain: "spotify.com",
		application: "Streaming",
		protocol: ["TCP"],
		ip: "192.168.1.10",
		port: 4040,
		direction: "out",
		scheduleStart: "2024-10-01 09:00",
		scheduleEnd: "2024-10-01 21:00",
	},
];
