# 🚀 Frontend Deployment Guide

This guide will help you deploy your React frontend to Render and connect it to your Django backend.

## Prerequisites

- ✅ Django backend deployed on Render
- ✅ React frontend code ready
- ✅ GitHub repository with frontend code

## Step 1: Prepare Frontend for Production

### Update API Configuration

The frontend is already configured to use your Render backend:
- **API URL**: `https://chatbot-npll.onrender.com`
- **Environment**: Production

### Files Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── api.ts          # API configuration
│   ├── components/
│   ├── pages/
│   └── App.tsx
├── public/
├── package.json
├── .env.production         # Production environment
├── render.yaml            # Render configuration
└── FRONTEND_DEPLOYMENT.md
```

## Step 2: Push Frontend to GitHub

### Option A: Push to Same Repository

```bash
# Navigate to project root
cd C:\Users\vinay\Desktop\Chatbot_Pro

# Add frontend files
git add frontend/
git commit -m "Add React frontend for deployment"

# Push to GitHub
git push origin main
```

### Option B: Create Separate Repository

```bash
# Navigate to frontend directory
cd frontend

# Initialize Git
git init
git add .
git commit -m "Initial commit: React frontend"

# Create new GitHub repository and push
git remote add origin https://github.com/yourusername/chatbot-frontend.git
git push -u origin main
```

## Step 3: Deploy to Render

### Method 1: Static Site (Recommended)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Select your GitHub repository
   - Choose the branch (main)

3. **Configure Service**
   ```
   Name: chatbot-frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://chatbot-npll.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

5. **Click "Create Static Site"**

### Method 2: Web Service

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"

2. **Configure Service**
   ```
   Name: chatbot-frontend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npx serve -s build -l $PORT
   ```

3. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://chatbot-npll.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

## Step 4: Configure CORS (Backend)

Update your backend CORS settings to allow your frontend domain:

### In Render Backend Environment Variables:

```
CORS_ALLOWED_ORIGINS=https://your-frontend-app.onrender.com,https://chatbot-npll.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-app.onrender.com,https://chatbot-npll.onrender.com
```

## Step 5: Test Deployment

### Check These URLs:

1. **Frontend**: `https://your-frontend-app.onrender.com`
2. **Backend Health**: `https://chatbot-npll.onrender.com/health/`
3. **API Test**: `https://chatbot-npll.onrender.com/api/`

### Test Features:

- ✅ Frontend loads without errors
- ✅ API calls work (check browser console)
- ✅ Chatbot creation works
- ✅ File uploads work
- ✅ Chat functionality works

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check browser console for CORS errors
   - Update backend CORS settings
   - Verify frontend URL in backend environment variables

2. **API Connection Issues**:
   - Check if backend is running
   - Verify API URL in frontend
   - Test backend health endpoint

3. **Build Failures**:
   - Check package.json dependencies
   - Verify Node.js version
   - Check build logs for errors

### Debug Commands:

```bash
# Test API connection
curl https://chatbot-npll.onrender.com/health/

# Check frontend build locally
npm run build

# Test production build
npx serve -s build
```

## Environment Variables

### Frontend (.env.production):
```
REACT_APP_API_URL=https://chatbot-npll.onrender.com
REACT_APP_ENVIRONMENT=production
```

### Backend (Render Environment Variables):
```
CORS_ALLOWED_ORIGINS=https://your-frontend-app.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-app.onrender.com
```

## Success Indicators

After successful deployment:

- ✅ Frontend loads at `https://your-frontend-app.onrender.com`
- ✅ No console errors in browser
- ✅ API calls to backend work
- ✅ Chatbot creation and management works
- ✅ File uploads work
- ✅ Chat functionality works

## Next Steps

1. **Set up Custom Domain** (optional)
2. **Configure SSL** (automatic on Render)
3. **Set up Monitoring** (optional)
4. **Scale Application** (as needed)

## Support

- Render Documentation: https://render.com/docs
- React Deployment: https://create-react-app.dev/docs/deployment/
- Render Community: https://community.render.com/ 