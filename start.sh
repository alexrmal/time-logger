#!/bin/bash

echo "Starting Personal Efficiency Dashboard..."
echo "Installing dependencies..."

npm run install-all

echo "All dependencies installed!"
echo "Starting development servers..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npm run dev
