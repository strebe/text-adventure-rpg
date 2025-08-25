#!/bin/bash
# Simple script to run the RPG game
# Make sure Node.js is installed on your system

echo "Starting Game..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Minimum version required: 18.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version.slice(1).localeCompare('$REQUIRED_VERSION', undefined, { numeric: true }) >= 0 ? 0 : 1)"; then
    echo "Node.js version $NODE_VERSION is too old!"
    echo "Please update to Node.js $REQUIRED_VERSION or higher"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start the game
echo "Launching game..."
echo ""
npm start
