import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const hosts = [
	{
		id: "1",
		appName: "Brave",
		path: "/brave.exe",
		os: "Linux",
		platform: "x86_64",
	},
	{
		id: "1",
		appName: "Brave",
		path: "/brave.exe",
		os: "Linux",
		platform: "x86_64",
	},
	{
		id: "13",
		appName: "Twitch",
		path: "/twitch.exe",
		os: "Linux",
		platform: "x86_64",
	},
	{
		id: "12",
		appName: "Edge",
		path: "/edge.exe",
		os: "Linux",
		platform: "x86_64",
	},
];

export function AppSelect({
	onSelect,
}: {
	onSelect: (host: (typeof hosts)[0]) => void;
}) {
	return (
		<Select
			onValueChange={(value) => onSelect(hosts.find((h) => h.id === value)!)}>
			<SelectTrigger className='w-[300px]'>
				<SelectValue placeholder='Select an Application' />
			</SelectTrigger>
			<SelectContent>
				{hosts.map((host) => (
					<SelectItem
						key={host.id}
						value={host.id}>
						{host.appName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
