"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DonutChart = ({ activeConnectionsNo, inactiveConnectionsNo }) => {
	// Chart data using state to enable dynamic updates
	const chartData = {
		labels: ["Active", "Inactive"],
		datasets: [
			{
				data: [activeConnectionsNo, inactiveConnectionsNo], // Corrected to use props
				backgroundColor: ["#0088FE", "#FF8042"],
				borderWidth: 0,
			},
		],
	};

	// Chart options
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false, // Set to false if a custom legend is used
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.label || "";
						if (context.parsed !== null) {
							label += `: ${context.parsed}`;
						}
						return label;
					},
				},
			},
			title: {
				display: false, // Disable title for cleaner UI
			},
		},
		cutout: "75%", // Donut cutout percentage
	};

	return (
		<div
			style={{
				height: "200px",
				width: "100%",
				display: "flex",
				alignItems: "center",
			}}
		>
			<div
				style={{
					flex: "2",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div style={{ width: "70%", height: "70%" }}>
					<Doughnut data={chartData} options={options} />
				</div>
			</div>
			<div
				style={{
					flex: "1",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
					alignItems: "flex-start",
				}}
			>
				{/* Custom Legend */}
				{chartData.labels.map((label, index) => (
					<div
						key={label}
						style={{
							marginBottom: "8px",
							display: "flex",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: "12px",
								height: "12px",
								backgroundColor: chartData.datasets[0].backgroundColor[index],
								marginRight: "8px",
							}}
						></div>
						<span style={{ fontSize: "12px" }}>
							{label}: {chartData.datasets[0].data[index]}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default DonutChart;
