import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Sample Data
// const data = [
// 	{
// 		domain: "ipinfo.io.",
// 		timestamp: "2024-12-09T07:22:47.000Z",
// 		_id: "67569c33d88d2b9744da3c0b",
// 	},
// 	{
// 		domain: "ipinfo.io.",
// 		timestamp: "2024-12-09T11:15:00.000Z",
// 		_id: "67569c33d88d2b9744da3c0c",
// 	},
// 	{
// 		domain: "example.com.",
// 		timestamp: "2024-12-09T08:30:00.000Z",
// 		_id: "67569c33d88d2b9744da3c0d",
// 	},
// 	{
// 		domain: "ipinfo.io.",
// 		timestamp: "2024-12-09T07:40:00.000Z",
// 		_id: "67569c33d88d2b9744da3c0e",
// 	},
// ];

// Helper function to process data
const processData = (data) => {
	const groupedByDomain = {};
	console.log(data);

	// Group data by domain
	data.forEach(({ domain, timestamp }) => {
		if (!groupedByDomain[domain]) groupedByDomain[domain] = [];
		groupedByDomain[domain].push(new Date(timestamp));
	});

	// Count occurrences in 4-hour intervals for all domains
	const countsByTime = {};
	Object.entries(groupedByDomain).forEach(([domain, timestamps]) => {
		timestamps.forEach((ts) => {
			const roundedTimestamp = dayjs(ts)
				.startOf("hour")
				.subtract(ts.getHours() % 4, "hour")
				.toISOString();
			if (!countsByTime[roundedTimestamp]) countsByTime[roundedTimestamp] = {};
			countsByTime[roundedTimestamp][domain] =
				(countsByTime[roundedTimestamp][domain] || 0) + 1;
		});
	});

	// Convert to array format for recharts
	return Object.entries(countsByTime).map(([time, domainCounts]) => ({
		time,
		...domainCounts,
	}));
};

const CombinedDomainAreaChart = ({ data }) => {
	const chartData = processData(data);

	// Get all unique domains
	const domains = Array.from(new Set(data.map((d) => d.domain)));

	const colors = ["#8884d8", "#82ca9d", "#ffc658"]; // Example colors for domains

	return (
		<div>
			<h3>Combined Domain Access Chart</h3>
			<ResponsiveContainer
				width='100%'
				height={400}>
				<AreaChart data={chartData}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis
						dataKey='time'
						tickFormatter={(time) => dayjs(time).format("HH:mm")}
					/>
					<YAxis />
					<Tooltip
						labelFormatter={(time) => dayjs(time).format("YYYY-MM-DD HH:mm")}
					/>
					<Legend />
					{domains.map((domain, index) => (
						<Area
							key={domain}
							type='monotone'
							dataKey={domain}
							stackId='1'
							stroke={colors[index % colors.length]}
							fill={colors[index % colors.length]}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

// Render the component
const App = ({ data }) => {
	return (
		<div style={{ padding: "2rem" }}>
			<CombinedDomainAreaChart data={data} />
		</div>
	);
};

export default App;
