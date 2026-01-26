const { exec, spawn } = require('child_process');
const path = require('path');

class PlatformBlocker {
  constructor() {
    this.platform = process.platform;
    this.blockedApps = [];
    this.blockedSites = [];
  }

  // Block websites by modifying hosts file
  async blockWebsites(sites) {
    this.blockedSites = sites;
    
    switch (this.platform) {
      case 'win32':
        return this.blockWebsitesWindows(sites);
      case 'darwin':
        return this.blockWebsitesMac(sites);
      case 'linux':
        return this.blockWebsitesLinux(sites);
      default:
        throw new Error('Unsupported platform');
    }
  }

  async blockWebsitesWindows(sites) {
    const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    const redirectIP = '127.0.0.1';
    
    let hostsContent = '';
    
    // Add blocked sites to hosts file
    for (const site of sites) {
      hostsContent += `${redirectIP} ${site}\n`;
      hostsContent += `${redirectIP} www.${site}\n`;
    }
    
    // Add comment
    hostsContent = `# Focus Lock - Blocked Sites\n${hostsContent}\n`;
    
    try {
      // Create PowerShell script to modify hosts file
      const psScript = `
        $hostsPath = "${hostsPath}"
        $content = @"
${hostsContent}
"@
        Add-Content -Path $hostsPath -Value $content -Force
        Write-Host "Sites blocked successfully"
      `;
      
      await this.executeCommand(`powershell -Command "${psScript}"`);
      return true;
    } catch (error) {
      console.error('Failed to block websites on Windows:', error);
      return false;
    }
  }

  async blockWebsitesMac(sites) {
    const hostsPath = '/etc/hosts';
    const redirectIP = '127.0.0.1';
    
    let hostsContent = '';
    
    // Add blocked sites to hosts file
    for (const site of sites) {
      hostsContent += `${redirectIP} ${site}\n`;
      hostsContent += `${redirectIP} www.${site}\n`;
    }
    
    // Add comment
    hostsContent = `# Focus Lock - Blocked Sites\n${hostsContent}\n`;
    
    try {
      // Use sudo to modify hosts file
      const command = `echo "${hostsContent}" | sudo tee -a ${hostsPath}`;
      await this.executeCommand(command);
      return true;
    } catch (error) {
      console.error('Failed to block websites on macOS:', error);
      return false;
    }
  }

  async blockWebsitesLinux(sites) {
    const hostsPath = '/etc/hosts';
    const redirectIP = '127.0.0.1';
    
    let hostsContent = '';
    
    // Add blocked sites to hosts file
    for (const site of sites) {
      hostsContent += `${redirectIP} ${site}\n`;
      hostsContent += `${redirectIP} www.${site}\n`;
    }
    
    // Add comment
    hostsContent = `# Focus Lock - Blocked Sites\n${hostsContent}\n`;
    
    try {
      // Use sudo to modify hosts file
      const command = `echo "${hostsContent}" | sudo tee -a ${hostsPath}`;
      await this.executeCommand(command);
      return true;
    } catch (error) {
      console.error('Failed to block websites on Linux:', error);
      return false;
    }
  }

  // Unblock websites by removing entries from hosts file
  async unblockWebsites() {
    switch (this.platform) {
      case 'win32':
        return this.unblockWebsitesWindows();
      case 'darwin':
        return this.unblockWebsitesMac();
      case 'linux':
        return this.unblockWebsitesLinux();
      default:
        throw new Error('Unsupported platform');
    }
  }

  async unblockWebsitesWindows() {
    const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    
    try {
      const psScript = `
        $hostsPath = "${hostsPath}"
        $content = Get-Content $hostsPath | Where-Object { $_ -notmatch "# Focus Lock" -and $_ -notmatch "127.0.0.1" -and $_ -notmatch "::1" }
        Set-Content -Path $hostsPath -Value $content -Force
        Write-Host "Sites unblocked successfully"
      `;
      
      await this.executeCommand(`powershell -Command "${psScript}"`);
      return true;
    } catch (error) {
      console.error('Failed to unblock websites on Windows:', error);
      return false;
    }
  }

  async unblockWebsitesMac() {
    const hostsPath = '/etc/hosts';
    
    try {
      const command = `sudo sed -i '' '/# Focus Lock/,/^$/d' ${hostsPath}`;
      await this.executeCommand(command);
      return true;
    } catch (error) {
      console.error('Failed to unblock websites on macOS:', error);
      return false;
    }
  }

  async unblockWebsitesLinux() {
    const hostsPath = '/etc/hosts';
    
    try {
      const command = `sudo sed -i '/# Focus Lock/,/^$/d' ${hostsPath}`;
      await this.executeCommand(command);
      return true;
    } catch (error) {
      console.error('Failed to unblock websites on Linux:', error);
      return false;
    }
  }

  // Block applications (platform-specific)
  async blockApplications(apps) {
    this.blockedApps = apps;
    
    switch (this.platform) {
      case 'win32':
        return this.blockApplicationsWindows(apps);
      case 'darwin':
        return this.blockApplicationsMac(apps);
      case 'linux':
        return this.blockApplicationsLinux(apps);
      default:
        throw new Error('Unsupported platform');
    }
  }

  async blockApplicationsWindows(apps) {
    // Windows: Use Task Scheduler to block applications
    try {
      for (const app of apps) {
        const script = `
          $taskName = "FocusLock_Block_${app.replace(/[^a-zA-Z0-9]/g, '_')}"
          $action = New-ScheduledTaskAction -Execute "taskkill" -Argument "/f /im ${app}.exe"
          $trigger = New-ScheduledTaskTrigger -AtStartup -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration ([TimeSpan]::MaxValue)
          $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
          Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force
        `;
        
        await this.executeCommand(`powershell -Command "${script}"`);
      }
      return true;
    } catch (error) {
      console.error('Failed to block applications on Windows:', error);
      return false;
    }
  }

  async blockApplicationsMac(apps) {
    // macOS: Use AppleScript to block applications
    try {
      for (const app of apps) {
        const script = `
          tell application "System Events"
            set appProcesses to every process whose name contains "${app}"
            repeat with proc in appProcesses
              try
                quit proc
              end try
            end repeat
          end tell
        `;
        
        await this.executeCommand(`osascript -e "${script}"`);
      }
      return true;
    } catch (error) {
      console.error('Failed to block applications on macOS:', error);
      return false;
    }
  }

  async blockApplicationsLinux(apps) {
    // Linux: Kill processes by name
    try {
      for (const app of apps) {
        await this.executeCommand(`pkill -f "${app}"`);
      }
      return true;
    } catch (error) {
      console.error('Failed to block applications on Linux:', error);
      return false;
    }
  }

  // Unblock applications
  async unblockApplications() {
    switch (this.platform) {
      case 'win32':
        return this.unblockApplicationsWindows();
      case 'darwin':
        return this.unblockApplicationsMac();
      case 'linux':
        return this.unblockApplicationsLinux();
      default:
        throw new Error('Unsupported platform');
    }
  }

  async unblockApplicationsWindows() {
    try {
      const script = `
        Get-ScheduledTask | Where-Object {$_.TaskName -like "FocusLock_Block_*"} | Unregister-ScheduledTask -Confirm:$false
      `;
      
      await this.executeCommand(`powershell -Command "${script}"`);
      return true;
    } catch (error) {
      console.error('Failed to unblock applications on Windows:', error);
      return false;
    }
  }

  async unblockApplicationsMac() {
    // macOS: Remove any blocking scripts (simplified)
    return true;
  }

  async unblockApplicationsLinux() {
    // Linux: No persistent blocking, just stop killing processes
    return true;
  }

  // Execute shell command
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  // Get running processes
  async getRunningProcesses() {
    switch (this.platform) {
      case 'win32':
        return this.getRunningProcessesWindows();
      case 'darwin':
        return this.getRunningProcessesMac();
      case 'linux':
        return this.getRunningProcessesLinux();
      default:
        return [];
    }
  }

  async getRunningProcessesWindows() {
    try {
      const output = await this.executeCommand('tasklist /fo csv');
      const processes = output.split('\n').slice(1).map(line => {
        const parts = line.split(',');
        return parts[0] ? parts[0].replace(/"/g, '') : '';
      }).filter(name => name);
      
      return processes;
    } catch (error) {
      console.error('Failed to get running processes on Windows:', error);
      return [];
    }
  }

  async getRunningProcessesMac() {
    try {
      const output = await this.executeCommand('ps -ax -o comm=');
      const processes = output.split('\n').map(line => line.trim()).filter(name => name);
      
      return processes;
    } catch (error) {
      console.error('Failed to get running processes on macOS:', error);
      return [];
    }
  }

  async getRunningProcessesLinux() {
    try {
      const output = await this.executeCommand('ps -ax -o comm=');
      const processes = output.split('\n').map(line => line.trim()).filter(name => name);
      
      return processes;
    } catch (error) {
      console.error('Failed to get running processes on Linux:', error);
      return [];
    }
  }
}

module.exports = PlatformBlocker;
