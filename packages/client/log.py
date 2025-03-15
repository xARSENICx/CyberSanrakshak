import os
import time
import threading
import subprocess
import json
import platform
from shutil import copyfile
from scripts.linux_log_monitor import LinuxFirewallMonitor

def fetch_firewall_rules():
    """
    Fetch firewall rules and filter rules with "CSS" in their names.
    Cross-platform support for Windows and Linux.

    Returns a list of dictionaries containing rule metadata.
    """
    os_type = platform.system().lower()
    
    if os_type == 'windows':
        return fetch_windows_firewall_rules()
    else:
        return fetch_linux_firewall_rules()

def fetch_windows_firewall_rules():
    """
    Fetch Windows Firewall rules using netsh.
    """
    command = ["netsh", "advfirewall", "firewall", "show", "rule", "name=all"]
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        rules = []
        current_rule = {}
        for line in result.stdout.splitlines():
            line = line.strip()
            if line.startswith("Rule Name:"):
                if current_rule:
                    rules.append(current_rule)
                current_rule = {"Name": line.split("Rule Name:")[1].strip()}
            elif ":" in line:
                key, value = line.split(":", 1)
                current_rule[key.strip()] = value.strip()
        if current_rule:
            rules.append(current_rule)

        # Filter rules with "CSS" in the name
        css_rules = [rule for rule in rules if "CSS" in rule.get("Name", "")]
        return css_rules
    except Exception as e:
        print(f"Error fetching Windows firewall rules: {e}")
        return []

def fetch_linux_firewall_rules():
    """
    Fetch Linux firewall rules using LinuxFirewallMonitor.
    """
    try:
        monitor = LinuxFirewallMonitor()
        return monitor.fetch_firewall_rules()
    except Exception as e:
        print(f"Error fetching Linux firewall rules: {e}")
        return []

def parse_firewall_log_line(line):
    """
    Parse a single line from the Windows Firewall log.

    Returns a dictionary with details of the log entry or None for invalid lines.
    """
    parts = line.strip().split()
    if len(parts) < 9:
        return None

    return {
        "date": parts[0],
        "time": parts[1],
        "action": parts[2],
        "protocol": parts[3],
        "source_ip": parts[4],
        "destination_ip": parts[5],
        "source_port": parts[6],
        "destination_port": parts[7],
        "size": parts[8],
    }

def match_log_to_rule(log_entry, rules):
    """
    Match a log entry to a firewall rule by metadata.

    Returns the matching rule or None if no match is found.
    """
    for rule in rules:
        # Match protocol
        if log_entry["protocol"].lower() != rule.get("Protocol", "").lower():
            continue

        # Match ports (assuming rule ports are a string of ranges or values)
        local_port = rule.get("LocalPort", "")
        if log_entry["destination_port"] not in local_port:
            continue

        # Match remote IP (if specified in rule)
        remote_ip = rule.get("RemoteIP", "")
        if remote_ip != "Any":
            remote_ips = [ip.strip() for ip in remote_ip.split(",")]
            if log_entry["destination_ip"] not in remote_ips:
                continue

        return rule
    return None

def monitor_firewall_logs(log_path, backup_dir, rules, alert_file, max_size_kb=32):
    """
    Monitor the Windows Firewall log for dropped packets and log matches to CSS_ALERTS.
    This function is Windows-specific.
    """
    if not os.path.exists(log_path):
        print("Firewall log file not found. Ensure logging is enabled.")
        return

    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)

    last_position = 0

    while True:
        # Check log file size
        log_size_kb = os.path.getsize(log_path) / 1024
        if log_size_kb >= max_size_kb:
            print(f"Log file size exceeds {max_size_kb} KB. Backing up and resetting log...")
            backup_path = os.path.join(backup_dir, f"firewall_log_{time.strftime('%Y%m%d-%H%M%S')}.log")
            copyfile(log_path, backup_path)
            open(log_path, "w").close()

        with open(log_path, "r") as log_file:
            log_file.seek(last_position)
            for line in log_file:
                if line.startswith("#"):
                    continue

                event = parse_firewall_log_line(line)
                if event and event["action"].lower() == "drop":
                    matching_rule = match_log_to_rule(event, rules)
                    if matching_rule:
                        with open(alert_file, "a") as alert_log:
                            alert_log.write(
                                f"[ALERT] {event['date']} {event['time']} - Matched Rule: {matching_rule['Name']}\n"
                            )
                            alert_log.write(
                                f"    Protocol: {event['protocol']}, Source IP: {event['source_ip']}, Destination IP: {event['destination_ip']}\n"
                            )

            last_position = log_file.tell()

        time.sleep(1)  # Poll for new log entries every second

def start_monitoring_thread(log_path=None, backup_dir=None, alert_file=None):
    """
    Start a thread to monitor the firewall logs continuously.
    Cross-platform support for Windows and Linux.
    """
    os_type = platform.system().lower()
    
    if os_type == 'linux':
        start_linux_monitoring(alert_file or "CSS_ALERTS.log")
    else:
        start_windows_monitoring(log_path, backup_dir, alert_file)

def start_linux_monitoring(alert_file):
    """
    Start Linux firewall monitoring using LinuxFirewallMonitor.
    """
    try:
        monitor = LinuxFirewallMonitor()
        monitor.alert_file = alert_file
        monitor.start_monitoring()
        print(f"Linux firewall monitoring started. Alerts will be written to {alert_file}")
    except Exception as e:
        print(f"Error starting Linux monitoring: {e}")

def start_windows_monitoring(log_path, backup_dir, alert_file):
    """
    Start Windows firewall monitoring.
    """
    rules = fetch_firewall_rules()
    if not rules:
        print("No CSS-prefixed firewall rules found. Exiting.")
        return
    print(rules)
    print(f"Fetched {len(rules)} CSS-prefixed rules.")

    monitor_thread = threading.Thread(
        target=monitor_firewall_logs, args=(log_path, backup_dir, rules, alert_file), daemon=True
    )
    monitor_thread.start()

if __name__ == "__main__":
    os_type = platform.system().lower()
    
    if os_type == 'windows':
        FIREWALL_LOG_PATH = r"C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log"
        BACKUP_DIR = r"C:\\Windows\\System32\\LogFiles\\Firewall\\Backups"
        ALERT_FILE = r"CSS_ALERTS.log"
        start_monitoring_thread(FIREWALL_LOG_PATH, BACKUP_DIR, ALERT_FILE)
    else:
        ALERT_FILE = "CSS_ALERTS.log"
        start_monitoring_thread(alert_file=ALERT_FILE)

    print(f"Firewall monitoring started on {os_type}. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nMonitoring stopped.")
        if os_type == 'linux':
            # Stop Linux monitoring gracefully
            try:
                monitor = LinuxFirewallMonitor()
                monitor.stop_monitoring()
            except:
                pass
