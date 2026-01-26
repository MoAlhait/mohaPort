#!/bin/bash

echo "🚀 Focus Lock - Development Setup"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit https://nodejs.org/"
    echo "2. Download the LTS version"
    echo "3. Run the installer"
    echo ""
    echo "Or use Homebrew:"
    echo "  brew install node"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install Framer Motion
echo "🎨 Installing Framer Motion for animations..."
npm install framer-motion

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Framer Motion"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Server will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
