import subprocess
import os
import sys
import time
import platform

class FirewallAgent:
     def __init__(self):
          self.PORT_PROTOCOL_MAP = {
            80: "HTTP", 443: "HTTPS", 53: "DNS",
            21: "FTP", 22: "SSH", 25: "SMTP",
            110: "POP3", 143: "IMAP"
            }
          self.rules = []
          self.os_type = platform.system().lower()
     def execute_command(self ,command, success_message="Command executed successfully."):
        """Helper function to execute subprocess commands with OS-specific handling."""
        try:
            print("Executing command:", command)
            
            # Handle command based on OS
            if self.os_type == 'windows':
                # Windows can handle both string and list commands
                if isinstance(command, list):
                    result = subprocess.run(command, capture_output=True, text=True)
                else:
                    result = subprocess.run(command, capture_output=True, text=True, shell=True)
            else:  # Linux/Unix
                # Split command string into list for proper execution
                if isinstance(command, str):
                    command_list = command.split()
                else:
                    command_list = command
                result = subprocess.run(command_list, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(success_message)
                print(result.stdout.strip())
                print(type(result.stdout.strip()))
                return {"success": True, "message": result.stdout.strip(), "data":result.stdout.strip()}
            else:
                print("An error occurred:")
                print(result.stderr.strip())
                return {"success": False, "message": result.stderr.strip()}
        except Exception as e:
            print(f"Failed to execute command: {e}")
            return {"success": False, "message": str(e)}
    
     def check_privileges(self):
        """Check if running with appropriate privileges for the OS."""
        if self.os_type == 'windows':
            import ctypes
            try:
                return ctypes.windll.shell32.IsUserAnAdmin()
            except:
                return False
        else:  # Linux/Unix
            return os.geteuid() == 0
    
     def get_firewall_rules(self):
        """Get current firewall rules based on OS."""
        if self.os_type == 'windows':
            return self._get_windows_firewall_rules()
        else:
            return self._get_linux_firewall_rules()
    
     def _get_windows_firewall_rules(self):
        """Get Windows firewall rules using netsh."""
        try:
            command = ["netsh", "advfirewall", "firewall", "show", "rule", "name=all"]
            result = self.execute_command(command)
            if result["success"]:
                return self._parse_windows_rules(result["data"])
            return []
        except Exception as e:
            print(f"Error getting Windows firewall rules: {e}")
            return []
    
     def _get_linux_firewall_rules(self):
        """Get Linux firewall rules (UFW or iptables)."""
        try:
            # Try UFW first
            ufw_result = self.execute_command(["sudo", "ufw", "status", "numbered"])
            if ufw_result["success"] and "Status: active" in ufw_result["data"]:
                return self._parse_ufw_rules(ufw_result["data"])
            
            # Fallback to iptables
            iptables_result = self.execute_command(["sudo", "iptables", "-L", "-n", "--line-numbers"])
            if iptables_result["success"]:
                return self._parse_iptables_rules(iptables_result["data"])
            
            return []
        except Exception as e:
            print(f"Error getting Linux firewall rules: {e}")
            return []
    
     def _parse_windows_rules(self, output):
        """Parse Windows netsh firewall rules output."""
        rules = []
        lines = output.split('\n')
        current_rule = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith('Rule Name:'):
                if current_rule:
                    rules.append(current_rule)
                current_rule = {'name': line.split(':', 1)[1].strip()}
            elif line.startswith('Enabled:'):
                current_rule['enabled'] = line.split(':', 1)[1].strip()
            elif line.startswith('Direction:'):
                current_rule['direction'] = line.split(':', 1)[1].strip()
            elif line.startswith('Action:'):
                current_rule['action'] = line.split(':', 1)[1].strip()
            elif line.startswith('Protocol:'):
                current_rule['protocol'] = line.split(':', 1)[1].strip()
        
        if current_rule:
            rules.append(current_rule)
        
        return rules
    
     def _parse_ufw_rules(self, output):
        """Parse UFW status output."""
        rules = []
        lines = output.split('\n')
        
        for line in lines:
            if line.strip() and line[0].isdigit():
                parts = line.split()
                if len(parts) >= 3:
                    rule = {
                        'number': parts[0].rstrip(']').lstrip('['),
                        'action': 'ALLOW' if 'ALLOW' in line else 'DENY',
                        'protocol': 'tcp',  # Default
                        'port': '',
                        'source': '',
                        'destination': ''
                    }
                    
                    # Extract more details from the rule
                    for part in parts[1:]:
                        if part.isdigit():
                            rule['port'] = part
                        elif '/' in part and any(c.isdigit() for c in part):
                            rule['port'] = part.split('/')[0]
                            if '/' in part:
                                rule['protocol'] = part.split('/')[1]
                    
                    rules.append(rule)
        
        return rules
    
     def _parse_iptables_rules(self, output):
        """Parse iptables -L output."""
        rules = []
        lines = output.split('\n')
        current_chain = ''
        
        for line in lines:
            line = line.strip()
            if line.startswith('Chain '):
                current_chain = line.split()[1]
            elif line and line[0].isdigit():
                parts = line.split()
                if len(parts) >= 4:
                    rule = {
                        'chain': current_chain,
                        'number': parts[0],
                        'target': parts[1],
                        'protocol': parts[2],
                        'source': parts[3] if len(parts) > 3 else 'anywhere',
                        'destination': parts[4] if len(parts) > 4 else 'anywhere',
                        'port': ''
                    }
                    
                    # Extract port information if present
                    for i, part in enumerate(parts):
                        if 'dpt:' in part:
                            rule['port'] = part.split(':')[1]
                    
                    rules.append(rule)
        
        return rules