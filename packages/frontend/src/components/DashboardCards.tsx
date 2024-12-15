"use client";

import React from "react";
import { getAgentStatistics } from "@/lib/utils/agentStats";
import { nodes } from "@/data/nodesData";

const DashboardCards = () => {
  const stats = getAgentStatistics(nodes);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-auto md:h-[270px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Dashboard Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex flex-col items-start mb-2">
            <p className="text-gray-700 font-semibold">Active Agents:</p>
            <p className="text-gray-900 text-sm">{stats.activeCount}</p>
          </div>
          <div className="flex flex-col items-start mb-2">
            <p className="text-gray-700 font-semibold">Last Registered Agent:</p>
            <p className="text-gray-900 text-sm">{stats.mostRecentRegistrationAgent ? stats.mostRecentRegistrationAgent.deviceName : "N/A"}</p>
          </div>
          <div className="flex flex-col items-start mb-2">
            <p className="text-gray-700 font-semibold">Disconnected:</p>
            <p className="text-gray-900 text-sm">{stats.disconnectedCount}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col items-start mb-2">
            <p className="text-gray-700 font-semibold">Never Connected:</p>
            <p className="text-gray-900 text-sm">{stats.neverConnectedCount}</p>
          </div>
          <div className="flex flex-col items-start mb-2">
            <p className="text-gray-700 font-semibold">Most Active Agent:</p>
            <p className="text-gray-900 text-sm">{stats.mostActiveAgent ? stats.mostActiveAgent.deviceName : "N/A"}</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-gray-700 font-semibold">Agents Coverage:</p>
            <p className="text-gray-900 text-sm">{stats.coveragePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
