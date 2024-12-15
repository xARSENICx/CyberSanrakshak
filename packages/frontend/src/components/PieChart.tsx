/** @format */
"use client"; // Ensure this is a client component

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Example data for active, connected, and disconnected connections
const data = {
  labels: ['Active Connections', 'Connected Connections', 'Disconnected Connections'],
  datasets: [
    {
      label: 'Connections',
      data: [50, 20, 10], // Replace these values with dynamic data if needed
      backgroundColor: ['#4caf50', '#2196f3', '#f44336'], // Colors for each state
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
};

const MyPieChart = () => {
  return <Pie data={data} options={options} />;
};

export default MyPieChart;
