import React, { useState } from "react";

const email = "admin@mail.com";
const rules = [
  {
    rule_name: "Block Social Media",
    appName: "Facebook",
    domain: "facebook.com",
    app_path: "C:/Program Files/Facebook/app.exe",
    ports: [80, 443],
    action: "block",
    direction: "outbound",
    trigger_count: 15,
  },
  {
    rule_name: "Allow Local Server",
    appName: "Node.js Server",
    domain: "localhost",
    app_path: "C:/Program Files/Nodejs/server.js",
    ports: [3000, 8080],
    action: "allow",
    direction: "inbound",
    trigger_count: 8,
  },
  {
    rule_name: "Block Torrent Downloads",
    appName: "uTorrent",
    domain: "torrent.net",
    app_path: "C:/Program Files/uTorrent/uTorrent.exe",
    ports: [6881, 6882, 6889],
    action: "block",
    direction: "outbound",
    trigger_count: 32,
  },
  {
    rule_name: "Allow Email Service",
    appName: "Outlook",
    domain: "outlook.com",
    app_path: "C:/Program Files/Outlook/outlook.exe",
    ports: [25, 587],
    action: "allow",
    direction: "outbound",
    trigger_count: 5,
  },
  {
    rule_name: "Block Gaming App",
    appName: "Steam",
    domain: "steam.com",
    app_path: "C:/Program Files/Steam/steam.exe",
    ports: [27015, 27036],
    action: "block",
    direction: "outbound",
    trigger_count: 27,
  },
  {
    rule_name: "Allow Secure Connections",
    appName: "VPN",
    domain: "vpnprovider.com",
    app_path: "C:/Program Files/VPN/vpn.exe",
    ports: [1194, 443],
    action: "allow",
    direction: "outbound",
    trigger_count: 12,
  },
];

// Dummy client data for now
const dummyClientData = [
  {
    clientID: "Client_001",
    last_ping: "2024-12-10T10:30:00Z",
  },
  {
    clientID: "Client_002",
    last_ping: "2024-12-10T11:00:00Z",
  },
];

export default function RulesTable() {
  const [clientData, setClientData] = useState(dummyClientData);

  const renderRules = (client) => {
    // Sort the rules by trigger_count in descending order
    const sortedRules = [...rules].sort((a, b) => b.trigger_count - a.trigger_count);

    return sortedRules.map((rule, index) => (
      <tr key={index}>
        <td className="px-4 py-2 border">{rule.rule_name}</td>
        <td className="px-4 py-2 border">{rule.appName}</td>
        <td className="px-4 py-2 border">{rule.domain}</td>
        <td className="px-4 py-2 border">{rule.app_path}</td>
        <td className="px-4 py-2 border">{rule.ports.join(", ")}</td>
        <td className="px-4 py-2 border">{rule.action}</td>
        <td className="px-4 py-2 border">{rule.direction}</td>
        <td className="px-4 py-2 border">{rule.trigger_count}</td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left">Rule Name</th>
            <th className="px-4 py-2 border text-left">App Name</th>
            <th className="px-4 py-2 border text-left">Domain</th>
            <th className="px-4 py-2 border text-left">App Path</th>
            <th className="px-4 py-2 border text-left">Ports</th>
            <th className="px-4 py-2 border text-left">Action</th>
            <th className="px-4 py-2 border text-left">Direction</th>
            <th className="px-4 py-2 border text-left">Trigger Count</th>
          </tr>
        </thead>
        <tbody>
          {clientData.length > 0 ? (
            clientData.map((client) => (
              <React.Fragment key={client.clientID}>
                <tr>
                  <td colSpan="8" className="text-left px-4 py-2 border">
                    <b>Client ID:</b> {client.clientID} | Last Ping:{" "}
                    {client.last_ping}
                  </td>
                </tr>
                {renderRules(client)}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
