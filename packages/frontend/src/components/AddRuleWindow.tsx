"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import axios from "axios";
import { Checkbox } from "./ui/checkbox";

interface Rule {
	rule_name: string;
	description: string;
	direction: "inbound" | "outbound";
	action: "allow" | "block";
	application: { name: string; path: string }[];
	domain: string[];
	hosts: string[];
	ports: number[];
}

interface AddRuleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddRuleDialog({ open, onOpenChange }: AddRuleDialogProps) {
	const [currentTab, setCurrentTab] = React.useState("host");
	const [rule, setRule] = React.useState<Rule>({
		rule_name: "",
		description: "",
		direction: "inbound",
		action: "allow",
		application: [],
		domain: [],
		hosts: [],
		ports: [],
	});

	const adminData = JSON.parse(localStorage.getItem("adminDetails"));
	const clientData = JSON.parse(localStorage.getItem("clientDetails"));
	const activeClients = JSON.parse(localStorage.getItem("activeClients"));

	function convertToNewFormat(originalData) {
		const newData = {
			data: [],
		};

		originalData.hosts.forEach((clientID) => {
			const rules = originalData.application.map((app) => ({
				rule_name: originalData.rule_name,
				appName: app.name,
				domains: originalData.domain,
				app_path: app.path,
				direction: originalData.direction,
				action: originalData.action,
				ip_addresses: originalData.ports, // Assuming ports are IP addresses in the new format
			}));

			newData.data.push({
				clientID: clientID,
				rules: rules,
			});
		});

		return newData;
	}

	const [searchTerm, setSearchTerm] = React.useState("");
	const onAddRule = async (rule) => {
		console.log(rule);

		const newData = convertToNewFormat(rule);
		console.log(newData);
		const response = await axios.post(
			"http://localhost:3000/rules/add-app-rules",
			newData
		);
		console.log(response);
	};

	const handleInputChange = (field: keyof Rule, value: any) => {
		setRule((prev) => ({ ...prev, [field]: value }));
	};

	const handleNext = () => {
		const tabs = ["host", "application", "domain", "ports", "rest"];
		const currentIndex = tabs.indexOf(currentTab);
		if (currentIndex < tabs.length - 1) {
			setCurrentTab(tabs[currentIndex + 1]);
		}
	};

	const handleAddRule = () => {
		onAddRule(rule);
		onOpenChange(false);
	};

	const filteredHosts = clientData.filter((client) =>
		client.device_info.device_name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const commonApps = React.useMemo(() => {
		if (rule.hosts.length === 0) return [];
		const selectedClients = clientData.filter((client) =>
			rule.hosts.includes(client.clientID)
		);
		const filteredApps = selectedClients.reduce((common, client) => {
			if (common.length === 0) return client.application_data;
			return common.filter((app) =>
				client.application_data.some((clientApp) => clientApp.name === app.name)
			);
		}, []);
		return filteredApps.filter((app) => app.name !== null);
	}, [rule.hosts, clientData]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline">+ Add Rule</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add New Rule</DialogTitle>
				</DialogHeader>
				<Tabs
					value={currentTab}
					onValueChange={setCurrentTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="host">Host</TabsTrigger>
						<TabsTrigger value="application">Application</TabsTrigger>
						<TabsTrigger value="domain">Domain</TabsTrigger>
						<TabsTrigger value="ports">Ports</TabsTrigger>
						<TabsTrigger value="rest">Rest</TabsTrigger>
					</TabsList>

					<TabsContent value="host" className="space-y-4">
						<Input
							placeholder="Search hosts"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<div>
							{filteredHosts.map((client) => (
								<div
									key={client.clientID}
									className="flex items-center space-x-2 space-y-2"
								>
									<Checkbox
										checked={rule.hosts.includes(client.clientID)}
										onCheckedChange={(checked) => {
											setRule((prev) => ({
												...prev,
												hosts: checked
													? [...prev.hosts, client.clientID] // Add to array if checked
													: prev.hosts.filter((id) => id !== client.clientID), // Remove if unchecked
											}));
										}}
										id={client.clientID}
									/>
									<Label htmlFor={client.clientID}>
										{client.device_info.device_name}
									</Label>
								</div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="application" className="space-y-4">
						<Select
							onValueChange={(value) => {
								const [name, path] = value.split("|");
								setRule((prev) => ({
									...prev,
									application: [...prev.application, { name, path }],
								}));
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select application" />
							</SelectTrigger>
							<SelectContent>
								{commonApps.map((app, index) => (
									<SelectItem key={index} value={`${app.name}|${app.path}`}>
										{app.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="flex flex-wrap gap-2">
							{rule.application.map((app, index) => (
								<Badge key={index} variant="secondary">
									{app.name}
									<Button
										variant="ghost"
										size="sm"
										className="ml-2 h-4 w-4 p-0"
										onClick={() =>
											setRule((prev) => ({
												...prev,
												application: prev.application.filter(
													(_, i) => i !== index
												),
											}))
										}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
						</div>
						{/* <Input
							placeholder='Application path'
							value={formData.rules[0]?.app_path ?? ""}
							onChange={(e) => handleInputChange("app_path", e.target.value)}
						/> */}
					</TabsContent>

					<TabsContent value="domain" className="space-y-4">
						<Input
							placeholder="Enter domains (comma-separated)"
							value={rule.domain.join(", ")}
							onChange={(e) =>
								handleInputChange(
									"domain",
									e.target.value.split(",").map((d) => d.trim())
								)
							}
						/>
						<Select
							onValueChange={(value) =>
								console.log("Selected category:", value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select domain category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="business">Business</SelectItem>
								<SelectItem value="personal">Personal</SelectItem>
								<SelectItem value="social">Social</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex flex-wrap gap-2">
							{rule.domain.map((domain, index) => (
								<Badge key={index} variant="secondary">
									{domain}
									<Button
										variant="ghost"
										size="sm"
										className="ml-2 h-4 w-4 p-0"
										onClick={() =>
											setRule((prev) => ({
												...prev,
												domain: prev.domain.filter((_, i) => i !== index),
											}))
										}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
						</div>
					</TabsContent>

					<TabsContent value="ports" className="space-y-4">
						<Input
							placeholder="Enter ports (comma-separated)"
							value={rule.ports.join(", ")}
							onChange={(e) =>
								handleInputChange(
									"ports",
									e.target.value
										.split(",")
										.map((port) => parseInt(port.trim()))
										.filter((port) => !isNaN(port))
								)
							}
						/>
						<div className="flex flex-wrap gap-2">
							{rule.ports.map((port, index) => (
								<Badge key={index} variant="secondary">
									{port}
									<Button
										variant="ghost"
										size="sm"
										className="ml-2 h-4 w-4 p-0"
										onClick={() =>
											setRule((prev) => ({
												...prev,
												ports: prev.ports.filter((_, i) => i !== index),
											}))
										}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
						</div>
					</TabsContent>

					<TabsContent value="rest" className="space-y-4">
						<Input
							placeholder="Rule name"
							value={rule.rule_name}
							onChange={(e) => handleInputChange("rule_name", e.target.value)}
						/>
						<Textarea
							placeholder="Rule description"
							value={rule.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
						/>
						<Select
							value={rule.direction}
							onValueChange={(value) =>
								handleInputChange("direction", value as "inbound" | "outbound")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select direction" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="inbound">Inbound</SelectItem>
								<SelectItem value="outbound">Outbound</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={rule.action}
							onValueChange={(value) =>
								handleInputChange("action", value as "allow" | "block")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select action" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="allow">Allow</SelectItem>
								<SelectItem value="block">Deny</SelectItem>
							</SelectContent>
						</Select>
					</TabsContent>
				</Tabs>
				<div className="flex justify-between mt-4">
					{currentTab !== "rest" ? (
						<Button onClick={handleNext}>Next</Button>
					) : (
						<Button onClick={handleAddRule}>Add Rule</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
