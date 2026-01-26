#!/bin/bash

# Portfolio Setup Script
echo "🚀 Setting up your portfolio project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    echo "📁 Creating public directory..."
    mkdir public
fi

# Create a sample favicon
echo "🎨 Creating sample favicon..."
cat > public/favicon.ico << 'EOF'
# This is a placeholder. Replace with your actual favicon.
EOF

echo ""
echo "🎉 Portfolio setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your personal information in:"
echo "   - app/layout.tsx (metadata)"
echo "   - app/page.tsx (personal details, skills, projects)"
echo "   - package.json (author information)"
echo ""
echo "2. Customize the design:"
echo "   - tailwind.config.js (colors, fonts)"
echo "   - app/globals.css (custom styles)"
echo ""
echo "3. Add your projects and content"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀" 