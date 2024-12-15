"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const HOSTS = [
	{ id: "5f867ba9-bec4-4ea1-bbf2-adb4873dccbb", name: "Host 1" },
	{ id: "6f867ba9-bec4-4ea1-bbf2-adb4873dccbb", name: "Host 2" },
];

const APPLICATIONS = [
	{ id: "1", name: "Application 1", path: "/path/to/app1" },
	{ id: "2", name: "Application 2", path: "/path/to/app2" },
];

interface BlockingRule {
	rule_name: string;
	domain?: string;
	application?: string;
	port?: string;
	direction: "inbound" | "outbound";
	action: "block" | "allow";
}

export default function BlockingModal() {
	const [open, setOpen] = useState(true);
	const [selectedHost, setSelectedHost] = useState("");
	const [currentTab, setCurrentTab] = useState("hosts");
	const [ruleName, setRuleName] = useState("");
	const [domain, setDomain] = useState("");
	const [application, setApplication] = useState("");
	const [port, setPort] = useState("");
	const [direction, setDirection] = useState<"inbound" | "outbound">(
		"outbound"
	);
	const [action, setAction] = useState<"block" | "allow">("block");

	const canProceed =
		selectedHost !== "" && (domain !== "" || application !== "" || port !== "");

	const handleSubmit = () => {
		if (!canProceed || !ruleName) return;

		const rule: BlockingRule = {
			rule_name: ruleName,
			direction,
			action,
		};

		if (domain) rule.domain = domain;
		if (application) rule.application = application;
		if (port) rule.port = port;

		const payload = {
			clientID: selectedHost,
			listType: "whitelist",
			rules: [rule],
		};

		console.log("Submitting:", payload);
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>
						What Do You Want to Block?
					</DialogTitle>
					<Button
						variant='ghost'
						size='icon'
						className='absolute right-4 top-4'
						onClick={() => setOpen(false)}>
						<X className='h-4 w-4' />
					</Button>
				</DialogHeader>
				<div className='mt-4'>
					<Tabs
						value={currentTab}
						onValueChange={setCurrentTab}>
						<TabsList className='grid w-full grid-cols-6'>
							<TabsTrigger
								value='hosts'
								className='text-center'>
								Hosts
							</TabsTrigger>
							<TabsTrigger
								value='applications'
								disabled={!selectedHost}>
								Applications
							</TabsTrigger>
							<TabsTrigger
								value='domains'
								disabled={!selectedHost}>
								Domains
							</TabsTrigger>
							<TabsTrigger
								value='ports'
								disabled={!selectedHost}>
								Ports
							</TabsTrigger>
							<TabsTrigger
								value='direction'
								disabled={!selectedHost}>
								Direction
							</TabsTrigger>
							<TabsTrigger
								value='action'
								disabled={!selectedHost}>
								Action
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value='hosts'
							className='space-y-4'>
							<Select
								value={selectedHost}
								onValueChange={setSelectedHost}>
								<SelectTrigger>
									<SelectValue placeholder='Select host' />
								</SelectTrigger>
								<SelectContent>
									{HOSTS.map((host) => (
										<SelectItem
											key={host.id}
											value={host.id}>
											{host.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</TabsContent>

						<TabsContent
							value='applications'
							className='space-y-4'>
							<Select
								value={application}
								onValueChange={setApplication}>
								<SelectTrigger>
									<SelectValue placeholder='Select application' />
								</SelectTrigger>
								<SelectContent>
									{APPLICATIONS.map((app) => (
										<SelectItem
											key={app.id}
											value={app.id}>
											{app.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</TabsContent>

						<TabsContent
							value='domains'
							className='space-y-4'>
							<Input
								placeholder='Enter domains (comma or space-separated)'
								value={domain}
								onChange={(e) => setDomain(e.target.value)}
							/>
						</TabsContent>

						<TabsContent
							value='ports'
							className='space-y-4'>
							<Input
								placeholder='Enter port number'
								type='number'
								value={port}
								onChange={(e) => setPort(e.target.value)}
							/>
						</TabsContent>

						<TabsContent
							value='direction'
							className='space-y-4'>
							<Select
								value={direction}
								onValueChange={(value: "inbound" | "outbound") =>
									setDirection(value)
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select direction' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='inbound'>Inbound</SelectItem>
									<SelectItem value='outbound'>Outbound</SelectItem>
								</SelectContent>
							</Select>
						</TabsContent>

						<TabsContent
							value='action'
							className='space-y-4'>
							<Select
								value={action}
								onValueChange={(value: "block" | "allow") => setAction(value)}>
								<SelectTrigger>
									<SelectValue placeholder='Select action' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='block'>Block</SelectItem>
									<SelectItem value='allow'>Allow</SelectItem>
								</SelectContent>
							</Select>
						</TabsContent>
					</Tabs>

					<div className='mt-4 space-y-4'>
						<Input
							placeholder='Enter rule name'
							value={ruleName}
							onChange={(e) => setRuleName(e.target.value)}
						/>
						<Button
							className='w-full'
							onClick={handleSubmit}
							disabled={!canProceed || !ruleName}>
							Add Rule
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
