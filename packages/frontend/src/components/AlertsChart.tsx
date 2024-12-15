"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	mlAlerts: {
		label: "ML Alerts",
		color: "hsl(var(--chart-1))",
	},
	firewallAlerts: {
		label: "Firewall Alerts",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

const dummyData = [
	{ date: "2024-12-03", mlAlerts: 2, firewallAlerts: 3 },
	{ date: "2024-12-04", mlAlerts: 5, firewallAlerts: 2 },
	{ date: "2024-12-05", mlAlerts: 4, firewallAlerts: 3 },
	{ date: "2024-12-06", mlAlerts: 6, firewallAlerts: 2 },
	{ date: "2024-12-07", mlAlerts: 3, firewallAlerts: 4 },
	{ date: "2024-12-08", mlAlerts: 5, firewallAlerts: 2 },
	{ date: "2024-12-09", mlAlerts: 6, firewallAlerts: 5 },
];

export default function AlertChart() {
	const [chartData, setChartData] = useState(dummyData);

	useEffect(() => {
		async function fetchAlertData() {
			try {
				const response = await fetch("/api/backend_api"); // Replace with actual API endpoint
				const data = await response.json();

				// Process data to calculate mlAlerts and firewallAlerts per day
				const alertCountByDate = {};
				data.forEach((alert) => {
					const date = new Date(alert.createdAt).toISOString().split("T")[0]; // Extract date
					if (!alertCountByDate[date]) {
						alertCountByDate[date] = { mlAlerts: 0, firewallAlerts: 0 };
					}
					if (alert.type === "ml") {
						alertCountByDate[date].mlAlerts += 1;
					} else if (alert.type === "firewall") {
						alertCountByDate[date].firewallAlerts += 1;
					}
				});

				// Convert to chart data format
				const formattedData = Object.entries(alertCountByDate).map(
					([date, { mlAlerts, firewallAlerts }]) => ({
						date,
						mlAlerts,
						firewallAlerts,
					})
				);

				setChartData(formattedData);
			} catch (error) {
				console.error("Error fetching alert data:", error);
			}
		}

		// Uncomment the line below to use API data when ready
		// fetchAlertData();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Daily Alerts</CardTitle>
				<CardDescription>
					Stacked bar chart showing the count of ML and Firewall alerts for each day.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<XAxis
							dataKey="date"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => {
								return new Date(value).toLocaleDateString("en-US", {
									weekday: "short",
								});
							}}
						/>
						<Bar
							dataKey="mlAlerts"
							stackId="alerts"
							fill="#4CAF50"
							// radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="firewallAlerts"
							stackId="alerts"
							fill="#FF5722"
							// radius={[4,4, 0, 0]}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									labelKey="date"
									indicator="line"
								/>
							}
							cursor={false}
							defaultIndex={1}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
