"use client";

import React, { useState } from "react";
import axios from "axios";
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

interface HostRule {
	[clientId: string]: Rule;
}

export default function RuleForm() {
	const [hostRules, setHostRules] = React.useState<HostRule>({});
	const [searchTerm, setSearchTerm] = React.useState("");

	const clientData = JSON.parse(localStorage.getItem("clientDetails"));

	const createDefaultRule = (clientID: string): Rule => ({
		rule_name: "",
		description: "",
		direction: "inbound",
		action: "allow",
		application: [],
		domain: [],
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

	const filteredHosts = clientData.filter((client) =>
		client.device_info.device_name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const getCommonApps = (clientID: string) => {
		const selectedClients = clientData.filter((client) =>
			hostRules[clientID]?.hosts?.includes(client.clientID)
		);

		return selectedClients.reduce((common, client) => {
			if (common.length === 0) return client.application_data;
			return common.filter((app) =>
				client.application_data.some((clientApp) => clientApp.name === app.name)
			);
		}, []);
	};

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
				ip_addresses: originalData.ports,
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
			console.log(hostRules);
			// Send rules
			const response = await axios.post(
				"http://localhost:3000/rules/add-app-rules",
				{ data: rulesToSend.flatMap((item) => item.data) }
			);
			console.log(response);
		} catch (error) {
			console.error("Error adding rules:", error);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h2 className='text-xl font-semibold mb-4'>Add New Rule</h2>

			<Input
				placeholder='Search hosts'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className='mb-4'
			/>

			{filteredHosts.map((client) => (
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
											{getCommonApps(client.clientID).map((app, index) => (
												<SelectItem
													key={index}
													value={`${app.name}|${app.path}`}>
													{app.name}
												</SelectItem>
											))}
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

									{/* Ports Section */}
									<div className='space-y-4 mb-4'>
										<Input
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

			<Button onClick={handleAddRule}>+ Add Rules</Button>
		</div>
	);
}
