#!/bin/bash

# Script to restart the development server and clear cache
echo "🔄 Restarting development server to clear schema cache..."

# Kill any existing Next.js processes
pkill -f "next dev" || true

# Wait a moment
sleep 2

# Start the development server
echo "🚀 Starting development server..."
npm run dev
