# Monitoring Guide - Keep Render Backend Alive

## 🎯 Problem
Render free tier spins down after 15 minutes of inactivity. This causes the first request to be slow (cold start).

## ✅ Recommended Solutions

### **Option 1: UptimeRobot (BEST - Free & Reliable)**

**Why UptimeRobot?**
- ✅ Free forever (50 monitors, 5-minute intervals)
- ✅ No coding required
- ✅ Email/SMS alerts when service is down
- ✅ Status page for monitoring
- ✅ Works from external servers (more reliable than self-ping)

**Setup Steps:**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Click "Add New Monitor"
4. Configure:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Intervue Polling Backend`
   - URL: `https://intervue-polling-system-nm0z.onrender.com/health`
   - Monitoring Interval: `5 minutes`
5. Click "Create Monitor"

**Result:** Your backend will receive a ping every 5 minutes, keeping it awake 24/7.

---

### **Option 2: Cron-Job.org (Alternative)**

**Setup:**
1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Create new cron job:
   - URL: `https://intervue-polling-system-nm0z.onrender.com/health`
   - Interval: `Every 5 minutes`
4. Save

---

### **Option 3: Self-Ping (Already Implemented - Backup)**

**How it works:**
- Server pings itself every 14 minutes
- Keeps itself from sleeping

**Enable Self-Ping:**
Add to Render environment variables:
```
ENABLE_SELF_PING=true
```

**Note:** External monitoring (UptimeRobot) is more reliable because:
- Works even if your app crashes
- Provides health monitoring and alerts
- Doesn't consume your server resources

---

## 🚀 Best Practice (Use Both)

1. **Primary:** UptimeRobot (external monitoring) - pings every 5 min
2. **Backup:** Self-ping (internal) - runs every 14 min
3. **Benefit:** Double protection + you get downtime alerts!

---

## 📊 Monitoring Endpoints

Your backend has two endpoints for monitoring:

### 1. **Root Endpoint (`/`)**
```
GET https://intervue-polling-system-nm0z.onrender.com/
```
Response:
```json
{
  "message": "Polling System API is running",
  "timestamp": "2025-12-01T12:00:00.000Z",
  "uptime": 3600,
  "status": "healthy"
}
```

### 2. **Health Endpoint (`/health`)** ⭐ Use this for monitoring
```
GET https://intervue-polling-system-nm0z.onrender.com/health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T12:00:00.000Z"
}
```

---

## 🔧 Configuration

### Environment Variables (Render)

```env
PORT=3000
FRONTEND_URL=https://intervue-polling-system-five.vercel.app
BACKEND_URL=https://intervue-polling-system-nm0z.onrender.com
ENABLE_SELF_PING=false  # Set to true if you want backup self-ping
```

**Recommendation:** 
- Use `ENABLE_SELF_PING=false` and rely on UptimeRobot
- Or use `ENABLE_SELF_PING=true` as backup alongside UptimeRobot

---

## 📈 Monitoring Dashboard

After setting up UptimeRobot, you'll get:
- ✅ Real-time status
- ✅ Response time graphs
- ✅ Uptime percentage (aim for 99.9%)
- ✅ Email alerts when down
- ✅ Public status page (optional)

---

## 🆘 Troubleshooting

### Backend still sleeping?
1. Check UptimeRobot is running (green status)
2. Verify monitoring URL is correct
3. Check Render logs for incoming requests
4. Ensure health endpoint returns 200 status

### UptimeRobot shows "Down"?
1. Check Render dashboard - service might be crashed
2. Check Render logs for errors
3. Verify CORS and environment variables
4. Redeploy if needed

---

## 💡 Pro Tips

1. **Monitor the `/health` endpoint** - it's lightweight and quick
2. **Set interval to 5 minutes** - keeps service warm without over-pinging
3. **Enable email alerts** - know immediately when service is down
4. **Create status page** - share with team/users
5. **Monitor response time** - track if service is getting slower

---

## 🎓 Why External Monitoring > Self-Ping

| Feature | Self-Ping | UptimeRobot |
|---------|-----------|-------------|
| Keeps server awake | ✅ | ✅ |
| Works if server crashes | ❌ | ✅ |
| Alerts when down | ❌ | ✅ |
| Status dashboard | ❌ | ✅ |
| Response time tracking | ❌ | ✅ |
| Free forever | ✅ | ✅ |
| Zero code changes | ❌ | ✅ |

---

## 🔗 Quick Links

- **UptimeRobot:** https://uptimerobot.com
- **Cron-Job.org:** https://cron-job.org
- **Your Backend:** https://intervue-polling-system-nm0z.onrender.com
- **Health Check:** https://intervue-polling-system-nm0z.onrender.com/health

---

**✨ Recommendation:** Set up UptimeRobot now (takes 2 minutes) and enjoy 99.9% uptime! 🚀
