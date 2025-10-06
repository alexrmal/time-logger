#!/bin/bash

echo "🚀 Starting Time Logger..."
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies  
cd client
npm install
cd ..

echo "✅ All dependencies installed!"
echo "🎯 Starting development servers..."
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev
