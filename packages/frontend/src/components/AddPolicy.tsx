import React from "react";
import { useParams } from "react-router-dom";

export default function AddPolicy() {
  const { agentId } = useParams<{ agentId: string }>();

  return (
    <div>
      <h1>Add Policy for Agent ID: {agentId}</h1>
      {/* Implement form or logic to add a policy for the agent here */}
    </div>
  );
}
