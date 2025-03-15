import { exec } from 'child_process';
import { getOperatingSystem, isWindows, isLinux } from './os-detector.js';

const dns_servers = [
    "8.8.8.8",      // Google DNS
    "8.8.4.4",      // Google DNS Secondary
    "1.1.1.1",      // Cloudflare
    "1.0.0.1",      // Cloudflare Secondary
    "9.9.9.9",      // Quad9
    "208.67.222.222", // OpenDNS
    "208.67.220.220"  // OpenDNS Secondary
];

export const getIpFromDomain = async (domain) => {
    const all_ips = new Set();

    for (const dns_server of dns_servers) {
        const command = `nslookup ${domain} ${dns_server}`;
        console.log("command", command);

        try {
            const result = await execCommand(command);
            console.log("result", result);

            // Extract IP addresses using regex
            const ip_pattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;  // Matches IPv4 addresses
            const ip_addresses = result.match(ip_pattern);

            // Add valid IPs to set
            if (ip_addresses) {
                ip_addresses.forEach(ip => {
                    // Exclude DNS server IPs and localhost
                    if (!ip.startsWith('127.') && !dns_servers.includes(ip)) {
                        all_ips.add(ip);
                    }
                });
            }
        } catch (error) {
            console.log(`nslookup command failed for DNS ${dns_server}: ${error.message}`);
        }
    }

    const unique_ips = Array.from(all_ips);
    console.log("unique_ips", unique_ips);
    if (unique_ips.length > 0) {
        console.log(`Resolved IP addresses across all DNS servers: ${unique_ips.join(', ')}`);
        return unique_ips;
    } else {
        console.log("No IP addresses found from any DNS server.");
        return [];
    }
};

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

export const generateFirewallCommand = async (actionRule, rule, listType) => {
    const os = getOperatingSystem();
    
    switch (os) {
        case 'windows':
            return await generateNetshCommand(actionRule, rule, listType);
        case 'linux':
            return await generateLinuxFirewallCommand(actionRule, rule, listType);
        default:
            throw new Error(`Unsupported operating system: ${os}`);
    }
};

export const generateNetshCommand = async (actionRule, rule, listType) => {
    const { rule_name, domain, app_path, action , direction, ports, protocol } = rule;
    const direction_flag = direction === "inbound" ? "in" : "out";
    const action_flag = action === "allow" ? "allow" : "block";
    
    const profile_flag = "profile=any"; // Specify the profile
    let base_command = [
        "netsh", "advfirewall", "firewall", actionRule === "delete" ? "delete" : "add", "rule",
        `name=${rule_name}`,
        `dir=${direction_flag}`,
        `action=${action_flag}`,
        profile_flag
    ];

    if (app_path) {
        base_command.push(`program="${app_path}"`);
    }

    if (domain) {
        const ip_addresses = await getIpFromDomain(domain);
        if (ip_addresses.length > 0) {
            base_command.push(`remoteip=${ip_addresses.join(',')}`);
        }
    }

    
    // Handle whitelist/blocklist specific logic
    const commands = [];

    if (listType === "whitelist") {
        // Block all connections except those in the whitelist
        const block_all_command = [
            "netsh", "advfirewall", "firewall", "add", "rule",
            `name=block_all_except_whitelist`,
            `dir=${direction_flag}`,
            `action=block`,
            profile_flag,
            `program="${app_path}"`,
            `remoteip=any`,
            "enable=yes",
        

        ];
        console.log("Generated command to block all except whitelist:", block_all_command.join(" "));
        commands.push(block_all_command.join(" "));
    } else if (listType === "blocklist") {
        // Allow all connections except those in the blocklist
        const allow_all_command = [
            "netsh", "advfirewall", "firewall", "add", "rule",
            `name=allow_all_except_blocklist`,
            `dir=${direction_flag}`,
            `action=allow`,
            profile_flag,
            `program="${app_path}"`,
            `remoteip=any`,
            "enable=yes",
           
        ];
        console.log("Generated command to allow all except blocklist:", allow_all_command.join(" "));
        commands.push(allow_all_command.join(" "));
    }

    if (ports && ports.length > 0) {
        ports.forEach(port => {
            let port_command = [...base_command];
            port_command.push(`localport=${port}`);
            port_command.push(`protocol=${protocol || "TCP"}`);
            port_command.push("enable=yes");
            console.log("Generated command:", port_command.join(" "));
            commands.push(port_command.join(" "));
        });
    } else {
        base_command.push("enable=yes");
        console.log("Generated command:", base_command.join(" "));
        commands.push(base_command.join(" "));
    }

    return commands;
};

const checkLinuxFirewallTool = async () => {
    try {
        await execCommand('which ufw');
        return 'ufw';
    } catch {
        return 'iptables';
    }
};

export const generateLinuxFirewallCommand = async (actionRule, rule, listType) => {
    const { rule_name, domain, app_path, action, direction, ports, protocol } = rule;
    const commands = [];

    const firewallTool = await checkLinuxFirewallTool();
    
    if (firewallTool === 'ufw') {
        return generateUfwCommands(actionRule, rule, listType);
    } else {
        return generateIptablesCommands(actionRule, rule, listType);
    }
};

const generateUfwCommands = async (actionRule, rule, listType) => {
    const { rule_name, domain, action, direction, ports, protocol } = rule;
    const commands = [];
    const ufwAction = action === 'allow' ? 'allow' : 'deny';
    const ufwDirection = direction === 'inbound' ? 'in' : 'out';

    if (actionRule === 'delete') {
        commands.push(`sudo ufw --force delete ${rule_name}`);
        return commands;
    }

    if (domain) {
        const ip_addresses = await getIpFromDomain(domain);
        for (const ip of ip_addresses) {
            if (ports && ports.length > 0) {
                for (const port of ports) {
                    commands.push(`sudo ufw ${ufwAction} ${ufwDirection} to ${ip} port ${port} proto ${protocol || 'tcp'}`);
                }
            } else {
                commands.push(`sudo ufw ${ufwAction} ${ufwDirection} to ${ip}`);
            }
        }
    } else if (ports && ports.length > 0) {
        for (const port of ports) {
            commands.push(`sudo ufw ${ufwAction} ${ufwDirection} ${port}/${protocol || 'tcp'}`);
        }
    }

    if (listType === 'whitelist') {
        commands.push(`sudo ufw default deny ${ufwDirection}`);
    } else if (listType === 'blocklist') {
        commands.push(`sudo ufw default allow ${ufwDirection}`);
    }

    return commands;
};

const generateIptablesCommands = async (actionRule, rule, listType) => {
    const { rule_name, domain, action, direction, ports, protocol } = rule;
    const commands = [];
    const chain = direction === 'inbound' ? 'INPUT' : 'OUTPUT';
    const target = action === 'allow' ? 'ACCEPT' : 'DROP';
    const iptablesAction = actionRule === 'delete' ? '-D' : '-A';

    if (domain) {
        const ip_addresses = await getIpFromDomain(domain);
        for (const ip of ip_addresses) {
            let command = `sudo iptables ${iptablesAction} ${chain}`;
            
            if (direction === 'outbound') {
                command += ` -d ${ip}`;
            } else {
                command += ` -s ${ip}`;
            }
            
            if (ports && ports.length > 0) {
                for (const port of ports) {
                    const portCommand = `${command} -p ${protocol || 'tcp'} --dport ${port} -j ${target} -m comment --comment "${rule_name}"`;
                    commands.push(portCommand);
                }
            } else {
                command += ` -j ${target} -m comment --comment "${rule_name}"`;
                commands.push(command);
            }
        }
    } else if (ports && ports.length > 0) {
        for (const port of ports) {
            const command = `sudo iptables ${iptablesAction} ${chain} -p ${protocol || 'tcp'} --dport ${port} -j ${target} -m comment --comment "${rule_name}"`;
            commands.push(command);
        }
    }

    if (listType === 'whitelist' && actionRule !== 'delete') {
        commands.push(`sudo iptables -A ${chain} -j DROP -m comment --comment "default_deny_${rule_name}"`);
    }

    return commands;
};