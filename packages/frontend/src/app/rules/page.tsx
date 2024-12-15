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
import { Plus, Import } from "lucide-react";
import { BlocksTable } from "@/components/RulesTable";
import { BlocksFilter } from "@/components/RulesFilterBox";
import { BlocksSort } from "@/components/SortRulesWindow";
import { AddRuleDialog } from "@/components/AddRuleWindow";
import { useToast } from "@/components/hooks/use-toast";
import { mockRules } from "@/data/rulesData";
import type { BlockRule, FilterOptions, SortOption } from "@/types/rules";

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
	return (
		<div className="container mx-auto py-6 w-full">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Rules</h1>
				<div className="flex gap-2">
					<AddRuleDialog
						open={isAddDialogOpen}
						onOpenChange={setIsAddDialogOpen}
					/>

					<Button variant="outline">
						<Import className="mr-2 h-4 w-4" />
						Import
					</Button>
				</div>
			</div>

			<Table className="w-[70vw] overflow-x-auto">
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
									{element?.clientIds ? element?.clientIds.join(", ") : "None"}
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
											className="hover:text-red-400 cursor-pointer"
										/>
									}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
