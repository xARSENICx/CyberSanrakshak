"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Use date-fns adapter for time parsing
import { nodes } from "../data/nodesData"; // Import nodes data

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// LineChartProps Interface
interface LineChartProps {
  data: {
    timestamps: string[];
    activeCounts: number[];
    disconnectedCounts: number[];
    neverConnectedCounts: number[];
  };
}

// Function to process the nodes data into time-series format
const processNodesData = (nodes: any[]) => {
  // Define a function to get counts based on status
  const countByStatus = (status: string) => nodes.filter(node => node.status === status).length;

  // Define the current time (or the latest available time)
  const currentTime = new Date().toISOString();
  
  // Generate time series data
  return {
    timestamps: [
      currentTime, // This example uses the current time. You should extend this to multiple time points.
    ],
    activeCounts: [countByStatus("active")],
    disconnectedCounts: [countByStatus("disconnected")],
    neverConnectedCounts: [countByStatus("never connected")],
  };
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  console.log("LineChart received data:", data);

  // Process nodes data into chart data format
  const chartDataFromNodes = processNodesData(nodes);

  const validData = data && data.timestamps?.length ? data : chartDataFromNodes;

  // Check if there's any valid data to show
  if (validData.timestamps.length === 0) {
    console.warn("No valid timestamps in the data to display.");
    return <div>No data available to display.</div>;
  }

  const chartData = {
    labels: validData.timestamps,
    datasets: [
      {
        label: "Active",
        data: validData.activeCounts,
        borderColor: "#0088FE",
        backgroundColor: "rgba(0, 136, 254, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Disconnected",
        data: validData.disconnectedCounts,
        borderColor: "#FF8042",
        backgroundColor: "rgba(255, 128, 66, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Never Connected",
        data: validData.neverConnectedCounts,
        borderColor: "#FFBB28",
        backgroundColor: "rgba(255, 187, 40, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "dd MMM, HH:mm", // Time format in tooltip
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return (
    <div style={{ height: '270px', width: '100%' }}>
      <div style={{ height: '100%' }}>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Agent Status Over Time</h3>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
