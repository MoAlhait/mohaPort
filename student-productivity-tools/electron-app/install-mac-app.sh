#!/bin/bash

echo "🍎 Focus Lock macOS App Installer"
echo "================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Check if DMG exists
DMG_PATH="$SCRIPT_DIR/dist/Focus Lock-1.0.0.dmg"
if [ ! -f "$DMG_PATH" ]; then
    echo "❌ DMG file not found at: $DMG_PATH"
    echo "Please run 'npm run build-mac' first to create the installer."
    exit 1
fi

echo "✅ Found DMG installer: $DMG_PATH"
echo ""

# Check if Applications directory exists
if [ ! -d "/Applications" ]; then
    echo "❌ Applications directory not found. Are you on macOS?"
    exit 1
fi

echo "📱 Installing Focus Lock to Applications folder..."
echo ""

# Mount the DMG
echo "🔧 Mounting DMG installer..."
MOUNT_POINT=$(hdiutil attach "$DMG_PATH" | grep "Volumes" | awk '{print $3}')
echo "✅ DMG mounted at: $MOUNT_POINT"

# Copy the app to Applications
echo "📦 Copying Focus Lock.app to Applications..."
if [ -d "$MOUNT_POINT/Focus Lock.app" ]; then
    cp -R "$MOUNT_POINT/Focus Lock.app" "/Applications/"
    echo "✅ Focus Lock.app installed successfully!"
else
    echo "❌ Focus Lock.app not found in DMG"
    hdiutil detach "$MOUNT_POINT" > /dev/null 2>&1
    exit 1
fi

# Unmount the DMG
echo "🔧 Unmounting DMG..."
hdiutil detach "$MOUNT_POINT" > /dev/null 2>&1
echo "✅ DMG unmounted"

# Remove quarantine attribute (allows app to run without security warnings)
echo "🛡️ Removing quarantine attribute..."
xattr -d com.apple.quarantine "/Applications/Focus Lock.app" 2>/dev/null || true
echo "✅ Quarantine attribute removed"

echo ""
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "📱 Your Focus Lock app is now installed in Applications!"
echo ""
echo "🚀 To launch the app:"
echo "   1. Open Applications folder"
echo "   2. Double-click 'Focus Lock'"
echo "   OR"
echo "   3. Use Spotlight: Cmd+Space, type 'Focus Lock', press Enter"
echo ""
echo "⚠️  Important: On first launch, you may need to:"
echo "   1. Allow the app in Security & Privacy settings"
echo "   2. Grant Accessibility permissions for app blocking"
echo "   3. Grant Full Disk Access for website blocking"
echo ""
echo "📖 For detailed setup instructions, see: MACOS-APP-GUIDE.md"
echo ""
echo "🔒 Ready to focus! Enjoy your distraction-free productivity! ✨"
