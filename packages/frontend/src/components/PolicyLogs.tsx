
import React from "react";
import { useParams } from "react-router-dom";

export default function PolicyLogs() {
  const { agentId } = useParams<{ agentId: string }>();

  return (
    <div>
      <h1>Policies and Logs for Agent ID: {agentId}</h1>
      {/* Display the policy and log details for the agent here */}
    </div>
  );
}
