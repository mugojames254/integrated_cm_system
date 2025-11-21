#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=========================================="
echo "Starting Render Build Process"
echo "=========================================="

echo "Step 1: Installing root dependencies..."
npm install

echo "Step 2: Moving to client directory..."
cd client

echo "Step 3: Installing client dependencies..."
npm install

echo "Step 4: Building React app..."
npm run build

echo "Step 5: Verifying build..."
if [ -d "build" ]; then
  echo "✅ Build directory created successfully!"
  ls -la build/
else
  echo "❌ ERROR: Build directory not found!"
  exit 1
fi

cd ..

echo "=========================================="
echo "Build completed successfully!"
echo "=========================================="
