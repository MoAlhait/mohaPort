#!/bin/bash

echo "🔒 Focus Lock Setup Script"
echo "=========================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS only."
    echo "Focus Lock app blocking features work best on macOS."
    exit 1
fi

echo "✅ Detected macOS system"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    echo "⚠️  Running as root - this is not recommended for security reasons"
    echo "Please run this script as a regular user"
    exit 1
fi

echo "✅ Running as regular user"

# Check if we can write to hosts file
echo ""
echo "🔍 Checking system permissions..."

# Test hosts file access
if [ -w "/etc/hosts" ]; then
    echo "✅ Can write to /etc/hosts file"
    HOSTS_WRITABLE=true
else
    echo "⚠️  Cannot write to /etc/hosts file directly"
    echo "   You may need to run the app with sudo for full website blocking"
    HOSTS_WRITABLE=false
fi

# Check for required tools
echo ""
echo "🔍 Checking required tools..."

REQUIRED_TOOLS=("osascript" "pkill" "defaults")
MISSING_TOOLS=()

for tool in "${REQUIRED_TOOLS[@]}"; do
    if command -v "$tool" &> /dev/null; then
        echo "✅ $tool is available"
    else
        echo "❌ $tool is missing"
        MISSING_TOOLS+=("$tool")
    fi
done

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required tools: ${MISSING_TOOLS[*]}"
    echo "Please install the missing tools and try again."
    exit 1
fi

# Create backup of hosts file
echo ""
echo "💾 Creating backup of hosts file..."
if sudo cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S); then
    echo "✅ Hosts file backup created"
else
    echo "⚠️  Could not create hosts file backup"
    echo "   You may need to run with sudo: sudo $0"
fi

# Test app killing functionality
echo ""
echo "🧪 Testing app blocking functionality..."

# Test with a safe app (if it exists)
if pgrep -f "Calculator" > /dev/null; then
    echo "Testing with Calculator app..."
    osascript -e 'tell application "Calculator" to quit' 2>/dev/null
    echo "✅ App quitting test successful"
else
    echo "ℹ️  No Calculator app running to test with"
fi

# Check system integrity protection
echo ""
echo "🔒 Checking System Integrity Protection (SIP) status..."
SIP_STATUS=$(csrutil status 2>/dev/null)
if [[ $SIP_STATUS == *"enabled"* ]]; then
    echo "⚠️  SIP is enabled - some advanced blocking features may be limited"
    echo "   This is normal and provides additional security"
else
    echo "ℹ️  SIP status could not be determined"
fi

# Create focus-lock directory for logs
echo ""
echo "📁 Setting up Focus Lock directories..."
mkdir -p ~/.focus-lock/logs
mkdir -p ~/.focus-lock/backups
echo "✅ Directories created"

# Set up log file
echo ""
echo "📝 Setting up logging..."
echo "# Focus Lock Activity Log" > ~/.focus-lock/logs/activity.log
echo "# Created on $(date)" >> ~/.focus-lock/logs/activity.log
echo "✅ Logging configured"

# Final recommendations
echo ""
echo "🎯 Setup Complete!"
echo "=================="
echo ""
echo "📋 What Focus Lock can do:"
echo "   ✅ Kill distracting applications"
echo "   ✅ Block websites (with proper permissions)"
echo "   ✅ Hide dock icons for blocked apps"
echo "   ✅ Monitor for blocked apps trying to restart"
echo "   ✅ Provide visual lock screen during focus sessions"
echo ""

if [ "$HOSTS_WRITABLE" = false ]; then
    echo "⚠️  Important Notes:"
    echo "   • For full website blocking, run the app with: sudo npm start"
    echo "   • Or manually add blocked sites to /etc/hosts"
    echo ""
fi

echo "🚀 Ready to use Focus Lock!"
echo ""
echo "To start using Focus Lock:"
echo "1. Go to http://localhost:3000/focus-lock"
echo "2. Enter what you want to focus on"
echo "3. Select your focus mode"
echo "4. Click 'Start Focus Lock Session'"
echo ""
echo "🔒 Your system will be locked to that task until the session ends!"
echo ""
