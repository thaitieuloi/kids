#!/bin/bash

echo "🔨 Soroban Math APK Builder"
echo "=========================="
echo ""

cd "$(dirname "$0")"

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if user is logged in
echo "🔐 Checking Expo login status..."
if ! eas whoami &> /dev/null; then
    echo "Please login to your Expo account:"
    echo "1. Create account at https://expo.dev/ (free)"
    echo "2. Run: eas login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting APK build..."
echo "This will take about 10-15 minutes..."
echo ""

# Build APK
eas build --platform android --profile preview

echo ""
echo "✅ Build completed!"
echo "📱 Download your APK from the link above"
echo "💾 Install on Android by enabling 'Unknown sources' in Settings"