#!/bin/bash

# Hairiva Development Server Startup Script
echo "🚀 Starting Hairiva Development Server..."
echo "📱 This will generate a QR code you can scan with your phone"
echo ""

# Start the Expo development server with tunnel for better mobile access
npx expo start --tunnel

echo ""
echo "✅ Development server started!"
echo "📱 Scan the QR code in the terminal or use the 'Show QR Code' button in the app"
echo "🔗 Make sure your phone and computer are on the same WiFi network"
