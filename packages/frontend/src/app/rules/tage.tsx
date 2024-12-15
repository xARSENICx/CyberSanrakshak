"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import useSocket from "@/lib/hooks/useSocket";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash } from "lucide-react";
import { toast } from "@/components/hooks/use-toast";
import { error } from "console";

interface Rule {
	rule_name: string;
	description: string;
	direction: "inbound" | "outbound";
	action: "allow" | "block";
	application: { name: string; path: string }[];
	domain: string[];
	ip: string[];
	hosts: string[];
	ports: number[];
}

interface HostRule {
	[clientId: string]: Rule;
}

export default function Blocks() {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const socket = useSocket();
	const [rules, setRules] = useState([]);
	const [disableIp, setDisableIp] = useState(true);
	const handleDeleteRule = async ({
		clientID,
		appName,
		ruleName,
		index,
	}: any) => {
		try {
			const response = await axios.post(
				`http://localhost:3000/rules/delete-rule`,
				{
					clientID,
					appName,
					ruleName,
				}
			);
			if (response.status == 200) {
				adminRules.splice(index, 1);
			}
			toast(response?.data?.message);
		} catch (error: any) {
			toast({
				title: error.response.data.message,
				description: "Or user may be offline",
			});
		}
	};
	const handleGetRules = async () => {
		const response = await axios.get(
			`http://localhost:3000/rules/get-rules-created-by-admin`
		);
		localStorage.setItem("admin_rules", JSON.stringify(response.data.rules));
	};

	useEffect(() => {
		handleGetRules();

		if (socket) {
			console.log(socket);
			socket.emit("message", {
				"data ": localStorage,
			});
			socket.on("message", (data) => {
				console.log("Received message:", data);
			});
			socket.on("get_rules", (data) => {
				console.log(data);
			});

			// Emit an event
			// socket.emit("joinRoom", { room: "room1" });
		}

		// Cleanup the listeners
		return () => {
			if (socket) {
				socket.off("message");
			}
		};
	}, [socket]);

	const adminRules = JSON.parse(localStorage.getItem("admin_rules"));

	const [hostRules, setHostRules] = React.useState<HostRule>({});
	const [searchTerm, setSearchTerm] = React.useState("");

	const clientData = JSON.parse(localStorage.getItem("clientDetails"));

	const createDefaultRule = (clientID: string): Rule => ({
		rule_name: "",
		description: "",
		direction: "outbound",
		action: "block",
		application: [],
		domain: [],
		ip: [],
		hosts: [clientID],
		ports: [],
	});

	const handleHostChange = (clientID: string, checked: boolean) => {
		setHostRules((prev) => {
			const newHostRules = { ...prev };

			if (checked) {
				// Add host if not exists
				if (!newHostRules[clientID]) {
					newHostRules[clientID] = createDefaultRule(clientID);
				}
			} else {
				// Remove host
				delete newHostRules[clientID];
			}

			return newHostRules;
		});
	};

	const handleInputChange = (
		clientID: string,
		field: keyof Rule,
		value: any
	) => {
		setHostRules((prev) => ({
			...prev,
			[clientID]: {
				...prev[clientID],
				[field]: value,
			},
		}));
	};

	const filteredHosts = clientData.filter((client: any) =>
		client.device_info.device_name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const getCommonApps = (clientID: string) => {
		const selectedClients = clientData.filter((client: any) =>
			hostRules[clientID]?.hosts?.includes(client.clientID)
		);

		return selectedClients.reduce((common: any, client: any) => {
			if (common.length === 0) return client.application_data;
			return common.filter((app: any) =>
				client.application_data.some(
					(clientAppa: any) => clientAppa?.name === app.name && app.name != ""
				)
			);
		}, []);
	};

	function convertToNewFormat(originalData: any) {
		const newData = {
			data: [],
		};

		originalData.hosts.forEach((clientID: any) => {
			const rules = originalData.application.map((app: any) => ({
				rule_name: originalData.rule_name,
				appName: app.name,
				domains: originalData.domain,
				app_path: app.path,
				direction: originalData.direction,
				action: originalData.action,
				ip_addresses: originalData.ip,
			}));

			newData.data.push({
				clientID: clientID,
				rules: rules,
			});
		});

		return newData;
	}

	const handleAddRule = async () => {
		try {
			// Convert and send all host rules
			const rulesToSend = Object.values(hostRules).map((rule) =>
				convertToNewFormat(rule)
			);
			console.log(rulesToSend);
			const ruleName = rulesToSend[0]?.data[0]?.rules[0]?.rule_name;
			console.log(rulesToSend[0]?.data[0]);

			const hasRuleName = adminRules?.some(
				(item: any) => item.rule_name === ruleName
			);
			if (hasRuleName) {
				toast({
					title: "Rule name not unique",
					description: "Names for the rules should be unique",
				});
				return;
			}
			// Send rules
			const response = await axios.post(
				"http://localhost:3000/rules/add-app-rules",
				{ data: rulesToSend.flatMap((item) => item.data) }
			);

			toast({
				title: response?.data?.message,
				description: "Added Rule successfully.",
			});
		} catch (error) {
			// toast({
			// 	title: error?.response?.data?.message,
			// 	description: "Added successfully.",
			// });
			console.error("Error adding rules:", error);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<Tabs
				defaultValue='account'
				className=''>
				<TabsList className='mb-4'>
					<TabsTrigger value='account'>Add Rule</TabsTrigger>
					<TabsTrigger value='password'>View Rules</TabsTrigger>
				</TabsList>
				<TabsContent value='account'>
					<h2 className='text-xl font-semibold mb-4'>Add New Rule</h2>
					<Input
						placeholder='Search hosts'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='mb-4'
					/>

					{filteredHosts.map((client: any) => (
						<Accordion
							key={client.clientID}
							type='single'
							collapsible>
							<AccordionItem value={client.clientID}>
								<div className='flex items-center space-x-2'>
									<input
										type='checkbox'
										checked={!!hostRules[client.clientID]}
										onChange={(e) =>
											handleHostChange(client.clientID, e.target.checked)
										}
									/>
									<AccordionTrigger>
										{client.device_info.device_name}
									</AccordionTrigger>
								</div>

								{hostRules[client.clientID] && (
									<AccordionContent>
										{/* Application Section */}
										<div className='space-y-4 mb-4'>
											<Select
												onValueChange={(value) => {
													const [name, path] = value.split("|");
													handleInputChange(client.clientID, "application", [
														...hostRules[client.clientID].application,
														{ name, path },
													]);
												}}>
												<SelectTrigger>
													<SelectValue placeholder='Select application' />
												</SelectTrigger>
												<SelectContent>
													{getCommonApps(client.clientID).map(
														(app: any, index: any) => (
															<SelectItem
																key={index}
																value={`${app.name}|${app.path}`}>
																{app.name}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>

											{/* Application Badges */}
											<div className='flex flex-wrap gap-2'>
												{hostRules[client.clientID].application.map(
													(app, index) => (
														<Badge
															key={index}
															variant='secondary'>
															{app.name}
															<Button
																variant='ghost'
																size='sm'
																className='ml-2 h-4 w-4 p-0'
																onClick={() => {
																	const updatedApps = hostRules[
																		client.clientID
																	].application.filter((_, i) => i !== index);
																	handleInputChange(
																		client.clientID,
																		"application",
																		updatedApps
																	);
																}}>
																<X className='h-3 w-3' />
															</Button>
														</Badge>
													)
												)}
											</div>

											{/* Domain Section */}
											<div className='space-y-4 mb-4'>
												<Input
													disabled={!disableIp}
													placeholder='Enter domains (comma-separated)'
													value={hostRules[client.clientID].domain.join(", ")}
													onChange={(e) =>
														handleInputChange(
															client.clientID,
															"domain",
															e.target.value.split(",").map((d) => d.trim())
														)
													}
												/>
												<div className='flex flex-wrap gap-2'>
													{hostRules[client.clientID].domain.map(
														(domain, index) => (
															<Badge
																key={index}
																variant='secondary'>
																{domain}
																<Button
																	variant='ghost'
																	size='sm'
																	className='ml-2 h-4 w-4 p-0'
																	onClick={() => {
																		const updatedDomains = hostRules[
																			client.clientID
																		].domain.filter((_, i) => i !== index);
																		handleInputChange(
																			client.clientID,
																			"domain",
																			updatedDomains
																		);
																	}}>
																	<X className='h-3 w-3' />
																</Button>
															</Badge>
														)
													)}
												</div>
											</div>

											{/* IP Section */}
											<div className='space-y-4 mb-4'>
												<Button
													onClick={() => {
														if (disableIp) {
															hostRules[client.clientID].domain = [];
															hostRules[client.clientID].ports = [];
														}

														setDisableIp(!disableIp);
													}}>
													Enable Ip Input
												</Button>
												<Input
													// disabled={disableIp}
													placeholder='Enter ip/range (comma-separated)'
													value={hostRules[client.clientID].ip.join(", ")}
													onChange={(e) =>
														handleInputChange(
															client.clientID,
															"ip",
															e.target.value.split(",").map((d) => d.trim())
														)
													}
												/>
												<div className='flex flex-wrap gap-2'>
													{hostRules[client.clientID].ip.map((ip, index) => (
														<Badge
															key={index}
															variant='secondary'>
															{ip}
															<Button
																variant='ghost'
																size='sm'
																className='ml-2 h-4 w-4 p-0'
																onClick={() => {
																	const updatedIps = hostRules[
																		client.clientID
																	].domain.filter((_, i) => i !== index);
																	handleInputChange(
																		client.clientID,
																		"ip",
																		updatedIps
																	);
																}}>
																<X className='h-3 w-3' />
															</Button>
														</Badge>
													))}
												</div>
											</div>

											{/* Ports Section */}
											<div className='space-y-4 mb-4'>
												<Input
													disabled={!disableIp}
													placeholder='Enter ports (comma-separated)'
													value={hostRules[client.clientID].ports.join(", ")}
													onChange={(e) =>
														handleInputChange(
															client.clientID,
															"ports",
															e.target.value
																.split(",")
																.map((port) => parseInt(port.trim()))
																.filter((port) => !isNaN(port))
														)
													}
												/>
											</div>

											{/* Rule Name and Description */}
											<div className='space-y-4 mb-4'>
												<Input
													placeholder='Rule name'
													value={hostRules[client.clientID].rule_name}
													onChange={(e) =>
														handleInputChange(
															client.clientID,
															"rule_name",
															e.target.value
														)
													}
												/>
												<Textarea
													placeholder='Rule description'
													value={hostRules[client.clientID].description}
													onChange={(e) =>
														handleInputChange(
															client.clientID,
															"description",
															e.target.value
														)
													}
												/>
												<Select
													value={hostRules[client.clientID].direction}
													onValueChange={(value) =>
														handleInputChange(
															client.clientID,
															"direction",
															value as "inbound" | "outbound"
														)
													}>
													<SelectTrigger>
														<SelectValue placeholder='Select direction' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='inbound'>Inbound</SelectItem>
														<SelectItem value='outbound'>Outbound</SelectItem>
													</SelectContent>
												</Select>
												<Select
													value={hostRules[client.clientID].action}
													onValueChange={(value) =>
														handleInputChange(
															client.clientID,
															"action",
															value as "allow" | "block"
														)
													}>
													<SelectTrigger>
														<SelectValue placeholder='Select action' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='allow'>Allow</SelectItem>
														<SelectItem value='block'>Deny</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</AccordionContent>
								)}
							</AccordionItem>
						</Accordion>
					))}

					<Button
						className='mt-4'
						onClick={handleAddRule}>
						+ Add Rules
					</Button>
				</TabsContent>
				<TabsContent value='password'>
					<Table className='w-[70vw] overflow-x-auto'>
						<TableHeader>
							<TableRow>
								<TableHead>Rule Name</TableHead>
								<TableHead>Clients</TableHead>
								<TableHead>Application</TableHead>
								<TableHead>direction</TableHead>
								<TableHead>domains</TableHead>
								<TableHead>ip addresses</TableHead>
								<TableHead>ports</TableHead>
								<TableHead>Action</TableHead>
								<TableHead>Trigger Count</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{adminRules?.map((element: any, index: any) => {
								return (
									<TableRow>
										<TableCell>{element?.rule_name}</TableCell>
										<TableCell>
											{element?.clientIds
												? element?.clientIds.join(", ")
												: "None"}
										</TableCell>
										<TableCell>{element?.appName || "Global rule"}</TableCell>
										<TableCell>{element?.direction}</TableCell>
										<TableCell>
											{element?.domains ? element?.domains.join(", ") : "None"}
										</TableCell>
										<TableCell>
											{element?.ip_addresses
												? element?.ip_addresses.join(", ")
												: "None"}
										</TableCell>
										<TableCell>
											{element?.ports ? element?.ports.join(", ") : "None"}
										</TableCell>
										<TableCell>{element?.action}</TableCell>
										<TableCell>{element?.trigger_count}</TableCell>
										<TableCell>
											{
												<Trash
													onClick={() => {
														for (let i = 0; i < element?.clientIds?.length; i++)
															handleDeleteRule({
																clientID: element?.clientIds[i],
																ruleName: element?.rule_name,
																appName: element?.appName,
																index: index,
															});
													}}
													className='hover:text-red-400 cursor-pointer'
												/>
											}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</div>
	);
}
