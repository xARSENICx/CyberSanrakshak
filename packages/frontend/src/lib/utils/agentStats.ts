// utils/agentStats.ts
import { Node } from "@/types"; // Adjust path as needed

export function getAgentStatistics(nodes: Node[]) {
  const activeCount = nodes.filter((node) => node.status === "active").length;
  const disconnectedCount = nodes.filter((node) => node.status === "disconnected").length;
  const neverConnectedCount = nodes.filter((node) => node.status === "never connected").length;

  // Get the agent that registered most recently
  const mostRecentRegistrationAgent = nodes.reduce((latest, node) => {
    if (!node.lastPing) return latest;
    return !latest || new Date(node.lastPing) > new Date(latest.lastPing) ? node : latest;
  }, null as Node | null);

  // Calculate the most active agent based on some criteria (lastPing in this case)
  const mostActiveAgent = nodes.reduce((mostActive, node) => {
    if (!node.lastPing) return mostActive;
    return !mostActive || new Date(node.lastPing) > new Date(mostActive.lastPing) ? node : mostActive;
  }, null as Node | null);

  const totalAgents = nodes.length;
  const coveragePercentage = ((activeCount / totalAgents) * 100).toFixed(2);

  return {
    activeCount,
    disconnectedCount,
    neverConnectedCount,
    mostRecentRegistrationAgent,
    mostActiveAgent,
    coveragePercentage,
  };
}
