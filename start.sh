#!/bin/bash

# Gear-Link App Launch Script
echo "🚀 Starting Gear-Link Outbound Automation Suite..."

# Start server
echo "📡 Starting server..."
cd /Users/allansmeyatsky/outbound/gear-link-app/server
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test server
echo "🧪 Testing server..."
curl -s http://localhost:5001/api/status > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Server is running!"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID
    exit 1
fi

# Start client
echo "🎨 Starting client..."
cd /Users/allansmeyatsky/outbound/gear-link-app/client
npm run dev &
CLIENT_PID=$!

echo ""
echo "🎉 Gear-Link App is now running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 Queue Status: http://localhost:5001/admin/queues"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait