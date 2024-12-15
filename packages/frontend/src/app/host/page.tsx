"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useUserStore } from "@/lib/store/userStore";

export default function HostsOverall() {
	const router = useRouter();

	const navigateToHost = (clientId: string) => {
		router.push(`/host/${clientId}`);
	};

	const adminData = JSON.parse(localStorage.getItem("adminDetails"));
	const overallData = JSON.parse(localStorage.getItem("clientDetails"));
	const activeClients = JSON.parse(localStorage.getItem("activeClients"));

	const inactiveClients = adminData.clientID.filter((clientID) => {
		return !activeClients.includes(clientID);
	});

	const HostCard = ({ clientData }: any) => (
		<Card
			className='mb-4 cursor-pointer hover:shadow-md transition-shadow'
			onClick={() => navigateToHost(clientData?.clientID)}>
			<CardHeader>
				<CardTitle>{clientData?.device_info?.device_name}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>IP: {clientData?.device_info?.public_ip}</p>
				<p>OS: {clientData?.device_info?.os}</p>
			</CardContent>
		</Card>
	);

	const renderHosts = (isActive: boolean) => {
		const clientIds = isActive ? activeClients : inactiveClients;

		return clientIds?.map((clientId) => {
			const clientData = overallData?.find(
				(data) => data.clientID === clientId
			);
			if (clientData) {
				return (
					<HostCard
						key={clientId}
						clientData={clientData}
					/>
				);
			}
			return null;
		});
	};

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Hosts Overview</h1>
			<p className='mb-6'>Admin: {adminData.email}</p>

			<div className='flex flex-col md:flex-row gap-6'>
				<div className='flex-1'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
						Active Hosts
					</h2>
					<ScrollArea className='h-[calc(100vh-200px)]'>
						{renderHosts(true)}
					</ScrollArea>
				</div>

				<div className='flex-1'>
					<h2 className='text-xl font-semibold mb-4 flex items-center'>
						<span className='w-3 h-3 bg-red-500 rounded-full mr-2'></span>
						Inactive Hosts
					</h2>
					<ScrollArea className='h-[calc(100vh-200px)]'>
						{renderHosts(false)}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
