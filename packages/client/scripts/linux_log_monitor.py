import os
import time
import threading
import subprocess
import re
from datetime import datetime
import platform

class LinuxFirewallMonitor:
    def __init__(self):
        self.ufw_log_path = "/var/log/ufw.log"
        self.iptables_log_path = "/var/log/kern.log"
        self.alert_file = "CSS_ALERTS.log"
        self.firewall_tool = self.detect_firewall_tool()
        self.monitoring = False
        self.monitor_thread = None
    
    def detect_firewall_tool(self):
        """Detect which firewall tool is being used."""
        try:
            subprocess.run(['which', 'ufw'], check=True, capture_output=True)
            return 'ufw'
        except subprocess.CalledProcessError:
            return 'iptables'
    
    def fetch_firewall_rules(self):
        """Fetch active firewall rules based on the detected tool."""
        rules = []
        try:
            if self.firewall_tool == 'ufw':
                result = subprocess.run(['sudo', 'ufw', 'status', 'numbered'], 
                                      capture_output=True, text=True, check=True)
                rules = self.parse_ufw_rules(result.stdout)
            else:
                result = subprocess.run(['sudo', 'iptables', '-L', '-n', '--line-numbers'], 
                                      capture_output=True, text=True, check=True)
                rules = self.parse_iptables_rules(result.stdout)
        except Exception as e:
            print(f"Error fetching firewall rules: {e}")
        
        # Filter CSS rules
        css_rules = [rule for rule in rules if "CSS" in rule.get("name", "")]
        return css_rules
    
    def parse_ufw_rules(self, output):
        """Parse UFW status output."""
        rules = []
        lines = output.split('\n')
        for line in lines:
            if 'CSS' in line and ('ALLOW' in line or 'DENY' in line):
                # Parse UFW rule format
                parts = line.split()
                if len(parts) >= 3:
                    rule = {
                        "name": f"CSS_{len(rules)}",
                        "action": "ALLOW" if "ALLOW" in line else "DENY",
                        "protocol": "tcp",  # Default
                        "port": "",
                        "source": "",
                        "destination": ""
                    }
                    # Extract port and IP information
                    for part in parts:
                        if part.isdigit():
                            rule["port"] = part
                        elif '.' in part and part.replace('.', '').replace('/', '').isdigit():
                            rule["destination"] = part
                    rules.append(rule)
        return rules
    
    def parse_iptables_rules(self, output):
        """Parse iptables -L output."""
        rules = []
        lines = output.split('\n')
        current_chain = ""
        
        for line in lines:
            if line.startswith('Chain '):
                current_chain = line.split()[1]
            elif 'CSS' in line or ('DROP' in line or 'ACCEPT' in line):
                parts = line.split()
                if len(parts) >= 4:
                    rule = {
                        "name": f"CSS_{len(rules)}",
                        "chain": current_chain,
                        "action": parts[1] if parts[1] in ['ACCEPT', 'DROP'] else 'UNKNOWN',
                        "protocol": parts[2] if len(parts) > 2 else 'all',
                        "source": parts[3] if len(parts) > 3 else 'anywhere',
                        "destination": parts[4] if len(parts) > 4 else 'anywhere',
                        "port": ""
                    }
                    # Extract port information
                    port_match = re.search(r'dpt:(\d+)', line)
                    if port_match:
                        rule["port"] = port_match.group(1)
                    rules.append(rule)
        return rules
    
    def parse_log_line(self, line):
        """Parse a firewall log line based on the tool."""
        if self.firewall_tool == 'ufw':
            return self.parse_ufw_log_line(line)
        else:
            return self.parse_iptables_log_line(line)
    
    def parse_ufw_log_line(self, line):
        """Parse UFW log line."""
        # UFW log format: timestamp hostname kernel: [UFW BLOCK] IN=... OUT=... SRC=... DST=... PROTO=... SPT=... DPT=...
        if '[UFW BLOCK]' in line or '[UFW ALLOW]' in line:
            event = {"action": "BLOCK" if "BLOCK" in line else "ALLOW"}
            
            # Extract fields using regex
            src_match = re.search(r'SRC=([^\s]+)', line)
            dst_match = re.search(r'DST=([^\s]+)', line)
            proto_match = re.search(r'PROTO=([^\s]+)', line)
            spt_match = re.search(r'SPT=([^\s]+)', line)
            dpt_match = re.search(r'DPT=([^\s]+)', line)
            
            if src_match and dst_match:
                event.update({
                    "source_ip": src_match.group(1),
                    "destination_ip": dst_match.group(1),
                    "protocol": proto_match.group(1) if proto_match else "unknown",
                    "source_port": spt_match.group(1) if spt_match else "0",
                    "destination_port": dpt_match.group(1) if dpt_match else "0",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                return event
        return None
    
    def parse_iptables_log_line(self, line):
        """Parse iptables log line."""
        # Look for iptables log entries
        if 'IN=' in line and 'OUT=' in line:
            event = {"action": "DROP"}  # Most iptables logs are for dropped packets
            
            # Extract fields
            src_match = re.search(r'SRC=([^\s]+)', line)
            dst_match = re.search(r'DST=([^\s]+)', line)
            proto_match = re.search(r'PROTO=([^\s]+)', line)
            spt_match = re.search(r'SPT=([^\s]+)', line)
            dpt_match = re.search(r'DPT=([^\s]+)', line)
            
            if src_match and dst_match:
                event.update({
                    "source_ip": src_match.group(1),
                    "destination_ip": dst_match.group(1),
                    "protocol": proto_match.group(1) if proto_match else "unknown",
                    "source_port": spt_match.group(1) if spt_match else "0",
                    "destination_port": dpt_match.group(1) if dpt_match else "0",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                return event
        return None
    
    def write_alert(self, event):
        """Write firewall event to alert file."""
        try:
            with open(self.alert_file, 'a') as f:
                alert_line = f"{event['timestamp']} - {event['action']} - {event['source_ip']}:{event['source_port']} -> {event['destination_ip']}:{event['destination_port']} ({event['protocol']})\n"
                f.write(alert_line)
                print(f"Alert written: {alert_line.strip()}")
        except Exception as e:
            print(f"Error writing alert: {e}")
    
    def monitor_logs(self):
        """Monitor firewall logs for events."""
        log_path = self.ufw_log_path if self.firewall_tool == 'ufw' else self.iptables_log_path
        
        if not os.path.exists(log_path):
            print(f"Log file {log_path} not found. Creating placeholder.")
            return
        
        print(f"Monitoring {log_path} for firewall events...")
        
        try:
            # Use tail -f equivalent to monitor logs
            process = subprocess.Popen(['tail', '-f', log_path], 
                                     stdout=subprocess.PIPE, 
                                     stderr=subprocess.PIPE, 
                                     universal_newlines=True)
            
            while self.monitoring:
                line = process.stdout.readline()
                if line:
                    event = self.parse_log_line(line.strip())
                    if event:
                        self.write_alert(event)
                        
        except Exception as e:
            print(f"Error monitoring logs: {e}")
        finally:
            if 'process' in locals():
                process.terminate()
    
    def start_monitoring(self):
        """Start log monitoring in a separate thread."""
        if not self.monitoring:
            self.monitoring = True
            self.monitor_thread = threading.Thread(target=self.monitor_logs)
            self.monitor_thread.daemon = True
            self.monitor_thread.start()
            print("Linux firewall monitoring started")
        else:
            print("Monitoring already active")
    
    def stop_monitoring(self):
        """Stop log monitoring."""
        if self.monitoring:
            self.monitoring = False
            if self.monitor_thread:
                self.monitor_thread.join(timeout=5)
            print("Linux firewall monitoring stopped")
        else:
            print("Monitoring not active")
    
    def get_recent_alerts(self, count=50):
        """Get recent alerts from the alert file."""
        try:
            if os.path.exists(self.alert_file):
                with open(self.alert_file, 'r') as f:
                    lines = f.readlines()
                    return lines[-count:] if len(lines) > count else lines
            return []
        except Exception as e:
            print(f"Error reading alerts: {e}")
            return []

# Example usage and testing
if __name__ == "__main__":
    monitor = LinuxFirewallMonitor()
    print(f"Detected firewall tool: {monitor.firewall_tool}")
    
    # Test rule fetching
    rules = monitor.fetch_firewall_rules()
    print(f"Found {len(rules)} CSS rules")
    
    # Test monitoring (uncomment to test)
    # monitor.start_monitoring()
    # time.sleep(30)  # Monitor for 30 seconds
    # monitor.stop_monitoring()