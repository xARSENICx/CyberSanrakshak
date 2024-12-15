"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, CogIcon } from "@heroicons/react/24/solid";
import { alerts } from "../data/alertsData"; // Import the nodes data
import { platform } from "os";

export default function NodesTable() {
	const router = useRouter(); // Initialize the router

	const navigateToPolicy = () => {
		router.push(`/policy`); // Navigate to the Policy page
	};

	const navigateToLog = () => {
		router.push(`/log`); // Navigate to the Log page
	};

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full bg-white border border-gray-200'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='px-4 py-2 border text-left'>Device Name</th>
						<th className='px-4 py-2 border text-left'>IP Address</th>
						<th className='px-4 py-2 border text-left'>Platform</th>
						<th className='px-4 py-2 border text-left'>Status</th>
						<th className='px-4 py-2 border text-left'>Recieved at</th>
						<th className='px-4 py-2 border text-left'>Alert</th>
						<th className='px-4 py-2 border text-left'>Description</th>
						<th className='px-4 py-2 border text-left'>Read</th>
					</tr>
				</thead>
				<tbody>
					{alerts.map((alert) => (
						<tr key={alert.nodeid}>
							<td className='px-4 py-2 border'>{alert.deviceName}</td>
							<td className='px-4 py-2 border'>{alert.ip}</td>
							<td className='px-4 py-2 border'>{alert.platform}</td>
							<td className='px-4 py-2 border'>
								<span
									className={`${
										alert.status === "active"
											? "text-green-600"
											: alert.status === "inactive"
											? "text-red-600"
											: "text-yellow-600"
									}`}>
									{alert.status}
								</span>
							</td>
							<td className='px-4 py-2 border'>{alert.lastPing}</td>
							<td className='px-4 py-2 border'>{alert.alert}</td>
							<td className='px-4 py-2 border'>{alert.description}</td>
							<td className='px-4 py-2 border'>
								<button
									onClick={navigateToPolicy}
									title='View Policies'>
									<EyeIcon className='h-5 w-5 text-blue-500' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
