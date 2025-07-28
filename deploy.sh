#!/bin/bash
# Frontend deployment script for Render

echo "🚀 Preparing React frontend for deployment..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! Check for errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Build frontend' && git push"
echo "2. Go to Render dashboard"
echo "3. Create Static Site or Web Service"
echo "4. Configure environment variables:"
echo "   REACT_APP_API_URL=https://chatbot-npll.onrender.com"
echo "5. Deploy!"
echo ""
echo "📖 See FRONTEND_DEPLOYMENT.md for detailed instructions" 