"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import Card, { CardContent, CardProps } from "@/components/Card";
import AgentsTable from "@/components/AgentsTable";
import MlAlerts from "@/components/MlAlerts";
import RulesAlerts from "@/components/RulesAlerts";
import DonutChart from "@/components/DonutChart";
import LineChart from "@/components/LineChart";
import DashboardCards from "@/components/DashboardCards"; // Import DashboardCards component
import "@fortawesome/fontawesome-free/css/all.min.css";
import Map from "@/components/Map";
import { useUserStore } from "@/lib/store/userStore";
import { useClientDataStore } from "@/lib/store/clientDataStore";
import { useAdminStore } from "@/lib/store/adminData";
import axios from "axios";
import AlertsChart from "@/components/AlertsChart";
import { useRouter } from "next/navigation";

const cardData: CardProps[] = [
	// Your card data here...
];

export default function Home() {
	const router = useRouter();
	const [coordinates, setCoordinates] = useState([]);

	useEffect(() => {
		const adminEmail = JSON.parse(localStorage.getItem("adminEmail"));
		if (!adminEmail) router.push("/login");
		const fetchDetails = async () => {
			const response = await axios.post("http://localhost:3000/details/", {
				email: adminEmail,
			});
			console.log(response);
			localStorage.setItem("adminDetails", JSON.stringify(response.data.admin));
			localStorage.setItem(
				"activeClients",
				JSON.stringify(response.data.activeClients)
			);
			localStorage.setItem(
				"clientDetails",
				JSON.stringify(response.data.clientDetails)
			);
			// localStorage.setItem("activeConnectionsNo", JSON.stringify(5));
			// localStorage.setItem("inactiveConnectionsNo", JSON.stringify(3));
		};
		fetchDetails();
	}, []);
	const adminData = JSON.parse(localStorage.getItem("adminDetails"));
	const clientData = JSON.parse(localStorage.getItem("clientDetails"));
	const activeClients = JSON.parse(localStorage.getItem("activeClients"));
	const inactiveClients = adminData?.clientID?.filter(
		(clientID) => !activeClients?.includes(clientID)
	);
	useEffect(() => {
		const fetchCoordinates = async () => {
			if (!clientData?.length) return;

			const activeClientData = clientData.filter((client) =>
				activeClients.includes(client.clientID)
			);

			const coordinatesArray = await Promise.all(
				activeClientData.map(async (client) => {
					try {
						const response = await axios.get(
							`http://ip-api.com/json/${client.device_info.public_ip}`
						);
						const { lat, lon } = response.data;
						return {
							lat,
							lng: lon,
							label: client.device_info.device_name || "Unknown",
						};
					} catch (error) {
						console.error(
							`Error fetching coordinates for IP ${client.device_info.public_ip}:`,
							error
						);
						return null;
					}
				})
			);

			const filteredCoordinates = coordinatesArray.filter(Boolean);

			// Only update state if the coordinates have changed
			if (JSON.stringify(filteredCoordinates) !== JSON.stringify(coordinates)) {
				setCoordinates(filteredCoordinates);
			}
		};

		fetchCoordinates();
	}, [clientData, activeClients, coordinates]); // Added coordinates to the dependencies to prevent infinite loop

	return (
		<div className='flex flex-col gap-4 w-full text-sm'>
			<div>Dashboard - {adminData?.email}</div>

			{/* Cards Section */}
			<section className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				{cardData.map((d, i) => (
					<Card
						key={i}
						amount={d.amount}
						discription={d.discription}
						icon={d.icon}
						label={d.label}
					/>
				))}
			</section>

			{/* Top Row: Donut Chart, Summary Card, Line Chart */}
			<section className='grid w-[85vw] md:w-full gap-4 grid-cols-1 md:grid-cols-3'>
				{/* Donut Chart */}
				<div className='flex-1'>
					<CardContent>
						<p className='font-semibold'>Connection Status</p>
						<DonutChart
							activeConnectionsNo={activeClients?.length ?? 0}
							inactiveConnectionsNo={inactiveClients?.length ?? 0}
						/>
					</CardContent>
				</div>

				<div>
					<CardContent>
						<p className='font-semibold'>Location of connected hosts</p>
						<AlertsChart />
					</CardContent>
				</div>
				<div>
					<CardContent>
						<p className='font-semibold'>Location of connected hosts</p>
						<Map coordinates={coordinates} />
					</CardContent>
				</div>
			</section>

			{/* Full-width Agents Table */}
			<section className='w-[85vw] md:w-full'>
				<CardContent>
					<p className='p-4 font-semibold'>Overview</p>
					<AgentsTable />
				</CardContent>
			</section>
			<section className='w-[85vw] md:w-full'>
				<CardContent>
					<p className='p-4 font-semibold'>Rule Alerts</p>
					{/* <MlAlerts /> */}
					<RulesAlerts />
				</CardContent>
			</section>
		</div>
	);
}
