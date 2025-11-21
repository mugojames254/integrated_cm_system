#!/bin/bash

# Construction Management System - Setup Script
# This script will install all dependencies and prepare the application

echo "═══════════════════════════════════════════════════════════"
echo "  Construction Management System - Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "To start the application, run one of the following:"
echo ""
echo "  Option 1 (Recommended): npm run dev"
echo "  Option 2: npm run server (in one terminal)"
echo "            npm run client (in another terminal)"
echo ""
echo "Default URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Demo Login Credentials:"
echo "  Admin:    username: admin     password: admin123"
echo "  Employee: username: john_doe  password: employee123"
echo ""
echo "═══════════════════════════════════════════════════════════"
