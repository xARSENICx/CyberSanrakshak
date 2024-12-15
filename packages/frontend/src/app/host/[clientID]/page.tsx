"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import ActiveApplications from "@/components/ActiveApplications";
import Card, { CardContent, CardProps } from "@/components/Card";
import { PolicyColumns, policies } from "@/data/policyData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GetServerSideProps } from "next";
import axios from "axios";
import ActiveConnections from "@/components/ActiveConnections";
import RunningProcesses from "@/components/RunningProcesses";
import OpenPorts from "@/components/OpenPorts";
import DomainMapping from "@/components/DomainMapping";
import ApplicationData from "@/components/ApplicationData";
import Interfaces from "@/components/Interfaces";
import { useUserStore } from "@/lib/store/userStore";
import { useAdminStore } from "@/lib/store/adminData";
import { useClientDataStore } from "@/lib/store/clientDataStore";
// import { useParams } from "react-router-dom";
import { useRouter, usePathname } from "next/navigation";
interface ClientProps {
	clientID: string;
}

// Node info
const nodeInfo = {
	deviceName: "Node 001",
	platform: "Linux",
	ip: "192.168.0.101",
	apiKey: "1234-5678-91011",
	userId: "User123",
	metadata: {
		os: "Ubuntu 20.04",
		cpuUsage: 45, // CPU usage in percentage
		memoryUsage: 60, // Memory usage in percentage
		diskUsage: 70, // Disk usage in percentage
	},
	lastPing: "2024-09-10 10:45:00",
	installedAt: "2024-01-01",
};
// Define policy table data
interface App {
	id: string;
	appName: string; // General application name
	lastUpdated: string;
	details: string;
	path: string;
	domains: string[];
	protocols: string[];
}
type Params = {
	params: any;
};

// Define columns for the DataTable
const AppColumns: ColumnDef<Policy>[] = [
	{
		accessorKey: "pid",
		header: "Process Id",
	},
	{
		accessorKey: "process_name",
		header: "Process Name",
	},
	{
		accessorKey: "exe",
		header: "Path",
	},
	{
		accessorKey: "app_name",
		header: "Application Name",
	},
];
const ActiveConnectionsColumns: ColumnDef<Policy>[] = [
	{
		accessorKey: "pid",
		header: "Process Id",
	},
	{
		accessorKey: "protocol",
		header: "Protocol",
	},
	{
		accessorKey: "local_address",
		header: "Local Address",
	},
	{
		accessorKey: "remote_address",
		header: "Remote Address",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "process_name",
		header: "Process Name",
	},
];

export default function PolicyPage() {
	// const [clientData, setClientData] = useState();

	const adminData = JSON.parse(localStorage.getItem("adminDetails"));
	const clientData = JSON.parse(localStorage.getItem("clientDetails"));
	const activeClients = JSON.parse(localStorage.getItem("activeClients"));
	const inactiveClients = [];

	// const adminDataFetched = useAdminStore((state) => state.adminData);
	// console.log(adminDataFetched);
	// //const fetchAdminData = useAdminStore((state) => state.fetchAdminData);
	// const clientDataFetched = useClientDataStore((state) => state.clientData);
	// console.log(clientDataFetched);
	//const fetchClientData = useClientDataStore((state) => state.fetchClientData);
	// const { clientID } = router.query;
	// const clientID = // Access the host_id
	// const { clientID } = useParams();
	const router = useRouter();

	// Get the current pathname, e.g., /page/section/item
	const pathname = usePathname();

	// Extract the last part of the URL
	const lastSegment = pathname?.split("/").filter(Boolean).pop();
	const clientID = lastSegment;

	const filteredClientData = clientData?.filter(
		(element: any) => element.clientID == clientID
	);
	const requiredClientData = filteredClientData[0];

	let isOnline = false;
	for (const active of activeClients) {
		if (active == clientID) {
			isOnline = true;
			break;
		}
	}

	const dataElement = useMemo(() => {
		return (
			<div className='bg-gray-100 p-2 border-2 shadow-md'>
				<div className='grid grid-cols-2 gap-x-8 gap-y-4 px-6 py-2 text-xs'>
					<div>
						<span className='font-semibold'>Device Name:</span>{" "}
						{requiredClientData?.device_info?.device_name || "N/A"}
					</div>
					<div>
						<span className='font-semibold'>OS:</span>{" "}
						{requiredClientData?.device_info?.os || "N/A"}
					</div>
					<div>
						<span className='font-semibold'>IP Address:</span>{" "}
						{requiredClientData?.device_info?.public_ip || "N/A"}
					</div>
					{requiredClientData?.device_info?.uptime.hours == 0 && (
						<div>
							<>
								<span className='font-semibold'>Up Time:</span>{" "}
								{requiredClientData?.device_info?.uptime?.days || ""} days{" "}
								{requiredClientData?.device_info?.uptime?.hours || ""} hours
							</>
						</div>
					)}
					<div>
						<span className='font-semibold'>CPU Cores:</span>{" "}
						{requiredClientData?.device_info?.cpu_info?.cpu_cores || "N/A"}
					</div>
					<div>
						<span className='font-semibold'>CPU Usage:</span>{" "}
						{requiredClientData?.device_info?.cpu_info?.cpu_usage || "N/A"}%
					</div>
					<div>
						<span className='font-semibold'>Total Memory:</span>{" "}
						{requiredClientData?.device_info?.memory_info?.total_memory?.toFixed(
							2
						) || "N/A"}
					</div>
					<div>
						<span className='font-semibold'>Used Memory:</span>{" "}
						{requiredClientData?.device_info?.memory_info?.used_memory?.toFixed(
							2
						) || "N/A"}
					</div>
					<div>
						<span className='font-semibold'>Last Ping:</span>{" "}
						{requiredClientData?.last_ping
							? new Date(requiredClientData.last_ping).toISOString()
							: "N/A"}
					</div>
				</div>
			</div>
		);
	});

	return (
		<div className='flex flex-col gap-5 w-full text-sm'>
			<div className='flex justify-between w-full '>
				<div className='flex gap-2 items-center'>
					<div>Host - {requiredClientData?.device_info?.device_name || ""}</div>
					{!isOnline ? (
						<div className='w-2 h-2 rounded-full bg-red-500'></div>
					) : (
						<div className='w-2 h-2 rounded-full bg-green-500'></div>
					)}
				</div>
			</div>
			Display Node Info
			{dataElement}
			{/* Policy DataTable */}
			<Tabs defaultValue='account'>
				<div className='w-full flex justify-center my-2'>
					<TabsList>
						<TabsTrigger value='account'>Running Processes</TabsTrigger>
						<TabsTrigger value='password'>Active Connections</TabsTrigger>
						<TabsTrigger value='ports'>Open Ports</TabsTrigger>
						<TabsTrigger value='domain'>Domain Mapping</TabsTrigger>
						<TabsTrigger value='appdata'>Application Data</TabsTrigger>
						<TabsTrigger value='interfaces'>Network Interfaces</TabsTrigger>
						<TabsTrigger value='network_usage'>Network Usage</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value='account'>
					<CardContent>
						<RunningProcesses data={requiredClientData?.running_processes} />
					</CardContent>
				</TabsContent>
				<TabsContent value='password'>
					<CardContent>
						<ActiveConnections data={requiredClientData?.active_connections} />
					</CardContent>
				</TabsContent>
				<TabsContent value='ports'>
					<CardContent>
						<OpenPorts data={requiredClientData?.open_ports} />
					</CardContent>
				</TabsContent>
				<TabsContent value='domain'>
					<CardContent>
						<DomainMapping data={requiredClientData?.domain_mapping} />
					</CardContent>
				</TabsContent>
				<TabsContent value='appdata'>
					<CardContent>
						<ApplicationData data={requiredClientData?.application_data} />
					</CardContent>
				</TabsContent>
				<TabsContent value='interfaces'>
					<CardContent>
						<Interfaces data={requiredClientData?.network_interfaces} />
					</CardContent>
				</TabsContent>
				<TabsContent value='network_usage'>
					<CardContent>
						<div className='bg-gray-100 p-2 border-2 shadow-md'>
							<div className='grid grid-cols-2 gap-x-8 gap-y-4 px-6 py-2 text-xs'>
								<div>
									<span className='font-semibold'>Time of report:</span>{" "}
									{requiredClientData?.network_usage?.time_of_report || "N/A"}
								</div>
								<div>
									<span className='font-semibold'>Bytes Sent:</span>{" "}
									{requiredClientData?.network_usage?.bytes_sent || "N/A"}
								</div>
								<div>
									<span className='font-semibold'>Bytes Received:</span>{" "}
									{(
										requiredClientData?.network_usage?.bytes_received /
										1000000000
									).toFixed(2) || "N/A"}
								</div>
								<div>
									<span className='font-semibold'>Packets Sent:</span>{" "}
									{requiredClientData?.network_usage?.packets_sent || "N/A"}
								</div>
								<div>
									<span className='font-semibold'>Packets received:</span>{" "}
									{requiredClientData?.network_usage?.packets_received || "N/A"}
								</div>
							</div>
						</div>
					</CardContent>
				</TabsContent>
			</Tabs>
		</div>
	);
}
