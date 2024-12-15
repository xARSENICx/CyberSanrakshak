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
		name: "Host 1",
		ip: "192.168.1.1",
		os: "Linux",
		platform: "x86_64",
	},
	{
		id: "2",
		name: "Host 2",
		ip: "192.168.1.2",
		os: "Windows",
		platform: "x86_64",
	},
	{
		id: "3",
		name: "Host 3",
		ip: "192.168.1.3",
		os: "macOS",
		platform: "arm64",
	},
];

export function HostSelect({
	onSelect,
}: {
	onSelect: (host: (typeof hosts)[0]) => void;
}) {
	return (
		<Select
			onValueChange={(value) => onSelect(hosts.find((h) => h.id === value)!)}>
			<SelectTrigger className='w-[300px]'>
				<SelectValue placeholder='Select a host' />
			</SelectTrigger>
			<SelectContent>
				{hosts.map((host) => (
					<SelectItem
						key={host.id}
						value={host.id}>
						{host.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
