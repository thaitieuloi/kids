#!/bin/bash

echo "🚀 Starting Soroban Math React Native App..."
echo "📱 Make sure to install Expo Go on your phone first!"
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Expo
echo "🎯 Starting Expo development server..."
echo "📲 Scan the QR code with Expo Go app on your phone"
echo ""

npx expo start