#!/bin/bash
echo ""
echo "  Brand Studio - Starting..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "  Node.js is not installed. Download it from https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
    echo ""
fi

# Copy .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  Created .env file - add your API key to .env and run this script again."
    exit 0
fi

# Start server and open browser
echo "  Starting server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000 &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 &> /dev/null &
fi
node server.js
