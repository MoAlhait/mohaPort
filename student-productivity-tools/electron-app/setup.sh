#!/bin/bash

echo "🚀 Focus Lock Desktop App Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old!"
    echo "Please upgrade to Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "Please install npm or reinstall Node.js"
    exit 1
fi

echo "✅ npm $(npm -v) is available"
echo ""

# Install dependencies
echo "📦 Installing Electron dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if web app is built
if [ ! -d "../out" ]; then
    echo "📦 Building Next.js web app first..."
    cd ..
    npm run build
    cd electron-app
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build web app"
        exit 1
    fi
    
    echo "✅ Web app built successfully"
else
    echo "✅ Web app already built"
fi

echo ""

# Create placeholder icons
echo "🎨 Creating placeholder icons..."
node assets/create-icons.js

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Could not create icons (this is optional)"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm start' to test the desktop app"
echo "2. Run 'npm run build' to create distribution files"
echo "3. Check the README.md for detailed usage instructions"
echo ""
echo "⚠️  Note: The app requires admin/sudo privileges for website blocking"
echo "⚠️  Some antivirus software may flag the app due to system modifications"
