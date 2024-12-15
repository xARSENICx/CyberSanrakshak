"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, CogIcon } from "@heroicons/react/24/solid";
import { nodes } from "../data/nodesData"; // Import the nodes data
import { useUserStore } from "@/lib/store/userStore";
import { useClientDataStore } from "@/lib/store/clientDataStore";
import { useAdminStore } from "@/lib/store/adminData";

export default function NodesTable() {
	// const adminDataFetched = useAdminStore((state) => state.adminData);
	// const fetchAdminData = useAdminStore((state) => state.fetchAdminData);
	// const clientDataFetched = useClientDataStore((state) => state.clientData);
	// const fetchClientData = useClientDataStore((state) => state.fetchClientData);
	// const admin = useUserStore((state) => state.user);
	const router = useRouter(); // Initialize the router

	// const clientData = clientDataFetched;

	// console.log(clientData);

	const navigateToPolicy = () => {
		router.push(`/policy`); // Navigate to the Policy page
	};

	const navigateToLog = () => {
		router.push(`/log`); // Navigate to the Log page
	};

	const navigateToHost = (node_id: any) => {
		router.push(`host/${node_id}`);
	};

	const adminData = JSON.parse(localStorage.getItem("adminDetails"));
	const clientData = JSON.parse(localStorage.getItem("clientDetails"));
	const activeClients = JSON.parse(localStorage.getItem("activeClients"));
	// const inactiveClients = [];

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full bg-white border border-gray-200'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='px-4 py-2 border text-left'>Client ID</th>
						<th className='px-4 py-2 border text-left'>Device Name</th>
						<th className='px-4 py-2 border text-left'>IP Address</th>
						<th className='px-4 py-2 border text-left'>OS</th>
					</tr>
				</thead>
				<tbody>
					{clientData?.map((node, index) => (
						<tr
							key={index}
							onClick={() => navigateToHost(node?.clientID)}
							className='cursor-pointer'>
							<td className='px-4 py-2 border'>{node?.clientID || ""}</td>
							<td className='px-4 py-2 border'>
								{node.device_info.device_name}
							</td>
							<td className='px-4 py-2 border'>
								{node?.device_info?.public_ip}
							</td>
							<td className='px-4 py-2 border'>{node?.device_info?.os}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
