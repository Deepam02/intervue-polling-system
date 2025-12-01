# Quick Deployment Guide

## ✅ Backend Already Deployed on Render
**URL:** https://intervue-polling-system-nm0z.onrender.com

### Update Backend Environment Variables on Render:
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add this variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `YOUR_VERCEL_URL` (add this after frontend deployment)

---

## 🚀 Frontend Deployment on Vercel

### Step 1: Push Updated Code to GitHub
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### Step 2: Deploy on Vercel Website

1. **Go to:** https://vercel.com/
2. **Sign in** with your GitHub account
3. **Click:** "Add New..." → "Project"
4. **Import** your repository: `Deepam02/intervue-polling-system`
5. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Add Environment Variable:**
   - Click "Environment Variables"
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://intervue-polling-system-nm0z.onrender.com`
   - **Apply to:** Production, Preview, and Development

7. **Click:** "Deploy"

### Step 3: Update Backend CORS

After Vercel gives you a URL (e.g., `https://your-app.vercel.app`):

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` variable:
   - **Value:** `https://your-vercel-app.vercel.app`
5. **Save** (this will trigger a redeploy)

---

## 📝 Environment Variables Summary

### Frontend (Vercel)
```
VITE_BACKEND_URL=https://intervue-polling-system-nm0z.onrender.com
```

### Backend (Render)
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## 🧪 Testing After Deployment

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Navigate to `/teacher` to test teacher view
3. Open `/student` in another browser/incognito
4. Test:
   - Teacher creates poll ✓
   - Students join ✓
   - Real-time updates work ✓
   - Timer functions ✓
   - Results display ✓

---

## 🔧 Troubleshooting

### WebSocket Connection Issues
- Check browser console for errors
- Verify `VITE_BACKEND_URL` in Vercel matches Render URL exactly
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- Ensure both URLs use HTTPS (not HTTP)

### CORS Errors
- Make sure `FRONTEND_URL` on Render is set correctly
- Check if backend service redeployed after updating environment variable
- Verify no trailing slashes in URLs

### Real-time Not Working
- Open browser developer tools → Network tab
- Look for WebSocket connection (should show as "ws" or "wss")
- Verify connection status is "101 Switching Protocols"

---

## 📌 Important Notes

- Backend may take 30-60 seconds to wake up (Render free tier)
- First WebSocket connection might be slow
- Both services need HTTPS for production
- Environment variables require service redeploy to take effect

---

## ✅ Deployment Checklist

- [x] Backend deployed on Render
- [ ] Push updated code to GitHub
- [ ] Deploy frontend on Vercel
- [ ] Add `VITE_BACKEND_URL` on Vercel
- [ ] Get Vercel URL
- [ ] Update `FRONTEND_URL` on Render
- [ ] Test end-to-end functionality
- [ ] Verify WebSocket connections
- [ ] Test with multiple students

---

**Ready to deploy!** Follow the steps above and your app will be live! 🎉
