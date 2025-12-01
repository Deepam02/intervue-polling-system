# Deployment Guide - Live Polling System

## Overview
This guide provides instructions for deploying both the frontend (React + Vite) and backend (Express.js + Socket.io) of the Live Polling System.

---

## Prerequisites
- Node.js (v16 or higher)
- Git installed
- Account on deployment platform (Render, Railway, or Vercel)

---

## Backend Deployment (Express + Socket.io)

### Option 1: Deploy on Render

1. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the service:**
   - **Name:** `polling-system-backend`
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

3. **Add Environment Variables:**
   - `PORT` = `3000` (Render will override this automatically)

4. **Deploy** and copy the backend URL (e.g., `https://polling-system-backend.onrender.com`)

### Option 2: Deploy on Railway

1. **Create a new project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure:**
   - Select your repository
   - Railway will auto-detect Node.js
   - Set **Root Directory** to `server` in settings
   - Deploy

3. **Copy the generated URL**

---

## Frontend Deployment (React + Vite)

### Step 1: Update Socket URL

Before deploying frontend, update the backend URL in `client/src/socket.js`:

```javascript
import { io } from 'socket.io-client';

// Replace with your deployed backend URL
const socket = io('https://YOUR-BACKEND-URL.com');

export default socket;
```

### Option 1: Deploy on Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   npm run build
   vercel --prod
   ```

   Or use the [Vercel Dashboard](https://vercel.com/):
   - Import your GitHub repository
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Option 2: Deploy on Netlify

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

   Or drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 3: Deploy on Render (Static Site)

1. **Create a new Static Site**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Static Site"

2. **Configure:**
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

---

## Complete Deployment Steps

### 1. Deploy Backend First
- Follow backend deployment steps above
- Note the backend URL

### 2. Update Frontend Configuration
```javascript
// client/src/socket.js
const socket = io('YOUR_BACKEND_URL');
```

### 3. Deploy Frontend
- Follow frontend deployment steps
- Note the frontend URL

### 4. Update CORS (Backend)
Update `server/server.js` to allow your frontend URL:

```javascript
const io = new Server(server, {
    cors: {
        origin: ["https://your-frontend-url.com"], // Add your frontend URL
        methods: ["GET", "POST"]
    }
});
```

Redeploy the backend after this change.

---

## Environment Variables Summary

### Backend
- `PORT` - Server port (auto-configured by hosting platform)

### Frontend
- No environment variables needed, but update socket URL in code

---

## Testing Deployment

1. **Open Teacher View:**
   ```
   https://YOUR-FRONTEND-URL/teacher
   ```

2. **Open Student View (in different browser/incognito):**
   ```
   https://YOUR-FRONTEND-URL/student
   ```

3. **Test Features:**
   - Teacher creates a poll
   - Students join with unique names
   - Students answer questions
   - Real-time updates work
   - Timer counts down properly
   - Results display correctly
   - Teacher can remove students
   - "Next Question" only works when all students answered

---

## Troubleshooting

### WebSocket Connection Issues
- Ensure backend URL is correct in `socket.js`
- Check CORS settings in backend
- Verify backend is using HTTPS (required by most browsers)

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (should be v16+)

### Real-time Updates Not Working
- Check browser console for WebSocket errors
- Verify backend is running and accessible
- Check firewall/network settings

---

## Alternative: Quick Test Deployment

### Using ngrok (for testing only)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start backend:**
   ```bash
   cd server
   npm start
   ```

3. **In a new terminal, expose backend:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** and update `client/src/socket.js`

5. **Start frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access locally** at `http://localhost:5173`

---

## Production Recommendations

1. **Use Environment Variables** for sensitive data
2. **Enable HTTPS** on both frontend and backend
3. **Set up proper CORS** to allow only your frontend domain
4. **Add rate limiting** to prevent abuse
5. **Use a database** (Redis/MongoDB) instead of in-memory storage for production
6. **Set up monitoring** (e.g., Sentry, LogRocket)
7. **Add authentication** for teacher access

---

## Support

For issues or questions:
- Check browser console for errors
- Review server logs on your hosting platform
- Ensure all dependencies are installed
- Verify WebSocket connections are not blocked by firewalls
