# 🚀 Gear-Link Outbound Automation Suite - Startup Guide

> **Location**: `/Users/allansmeyatsky/outbound/gear-link-app/`
> 
> **Status**: ✅ Fully Functional | Audited | Production Ready
> 
> **Last Updated**: February 8, 2026

---

## 🎯 Quick Start (2 Minutes)

### Option 1: Automated Launch
```bash
cd /Users/allansmeyatsky/outbound/gear-link-app
./start.sh
```

### Option 2: Manual Launch
```bash
# Terminal 1 - Server
cd /Users/allansmeyatsky/outbound/gear-link-app/server
npm start

# Terminal 2 - Client  
cd /Users/allansmeyatsky/outbound/gear-link-app/client
npm run dev
```

---

## 📱 Access Points & URLs

### 🎨 Frontend Application
- **URL**: http://localhost:5173
- **Description**: React dashboard with glassmorphic design
- **Features**: Lead management, campaign monitoring, queue status

### 🔧 Backend API
- **Base URL**: http://localhost:5001
- **Status Endpoint**: http://localhost:5001/api/status
- **Description**: Node.js + Express REST API

### 📊 Queue Monitoring
- **URL**: http://localhost:5001/admin/queues
- **Description**: Real-time queue status and job monitoring
- **Shows**: Scraper, Outreach, and Monitor queue statistics

### 🧪 API Endpoints
```bash
# Check system status
curl http://localhost:5001/api/status

# Get all leads
curl http://localhost:5001/api/leads

# Start scraping job
curl -X POST http://localhost:5001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"city":"New York"}'

# Get queue status
curl http://localhost:5001/admin/queues
```

---

## ⚙️ Environment Setup

### 1. Create Environment File
```bash
cd /Users/allansmeyatsky/outbound/gear-link-app/server
cp .env.example .env
```

### 2. Add API Keys to `.env`
```env
# Required API Keys
GOOGLE_PLACES_API_KEY=YOUR_GOOGLE_PLACES_API_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# Configuration
PORT=5001
APP_URL=http://localhost:5001
```

### 3. Install Dependencies
```bash
# Server dependencies
cd /Users/allansmeyatsky/outbound/gear-link-app/server
npm install

# Client dependencies
cd /Users/allansmeyatsky/outbound/gear-link-app/client
npm install
```

---

## 🔑 API Keys Setup Guide

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable "Places API"
4. Create credentials → API Key
5. Copy to `GOOGLE_PLACES_API_KEY`

### Google OAuth 2.0 (Gmail)
1. In same Google Cloud project
2. Enable "Gmail API"
3. Create OAuth 2.0 Client IDs
4. Add redirect URI: `http://localhost:5001/api/auth/google/callback`
5. Copy Client ID and Client Secret

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account/sign in
3. Create API key
4. Copy to `OPENAI_API_KEY`

---

## 🎯 Core Features & How to Use

### 1. 🕷️ Intelligent Scraper
**What it does**: Scrapes Google Places for rental shops in any target city
**How to use**: 
- Visit frontend → Dashboard
- Enter city name
- Click "Start Scraping"
- Monitor progress in queue status

### 2. 🤖 AI Personalization  
**What it does**: Uses GPT-4o to analyze shop websites and write personalized email hooks
**How it works**: Automatically runs after scraping finds websites
**Result**: Context-aware, personalized outreach messages

### 3. 📧 Gmail Automation
**What it does**: Sends automated emails via Gmail API with OAuth 2.0
**How to use**:
- Authenticate: http://localhost:5001/api/auth/google
- Select leads from frontend
- Click "Start Outreach"
- Monitor in campaigns tab

### 4. 📊 Response Tracking
**What it does**: Automatically detects replies and updates lead statuses
**How it works**: Runs every hour checking Gmail threads
**Result**: Real-time reply detection and status updates

### 5. 🔄 Queue Management
**What it does**: Background job processing with in-memory queues
**Monitor**: http://localhost:5001/admin/queues
**Queues**: Scraper, Outreach, Monitor

---

## 📂 Project Structure

```
gear-link-app/
├── 📄 start.sh                    # Launch script
├── 📄 SETUP_COMPLETE.md           # Detailed setup guide
├── 📄 README.md                   # Project overview
├── 📁 server/                     # Backend application
│   ├── 📄 index.js               # Main server file
│   ├── 📄 simple-queue.js        # In-memory queue system
│   ├── 📄 scraper.js             # Google Places scraper
│   ├── 📄 llm.js                 # OpenAI integration
│   ├── 📄 gmail.js               # Gmail API integration
│   ├── 📄 worker.js              # Background job processors
│   ├── 📄 db.js                  # SQLite database setup
│   └── 📄 .env.example           # Environment template
├── 📁 client/                     # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 pages/             # React pages (Dashboard, Leads)
│   │   ├── 📁 components/        # UI components
│   │   ├── 📁 api/               # API client
│   │   └── 📄 App.jsx            # Main React app
│   └── 📄 tailwind.config.js     # Tailwind CSS config
└── 📁 .git/                       # Git repository
```

---

## 🧪 Testing & Verification

### Health Checks
```bash
# Test server is running
curl http://localhost:5001/api/status
# Expected: {"status":"running","version":"1.0.0"}

# Test queue system
curl http://localhost:5001/admin/queues
# Expected: Queue statistics with all zeros initially

# Test database connection
curl http://localhost:5001/api/leads
# Expected: Empty array []
```

### Frontend Verification
1. Visit http://localhost:5173
2. Should see glassmorphic dashboard
3. Check navigation between pages
4. Verify API calls are working

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Check what's on port 5001
lsof -i :5001

# Kill process if needed
lsof -ti:5001 | xargs kill -9
```

### Client Not Connecting to Server
1. Verify server is running on port 5001
2. Check API URL in `client/src/api/index.js`
3. Ensure no CORS issues

### Queue Jobs Not Processing
1. Check worker.js is running
2. Verify queue status at `/admin/queues`
3. Check server console for errors

### Environment Issues
1. Verify `.env` file exists in server directory
2. Check all required API keys are set
3. Ensure no syntax errors in `.env`

---

## 🎉 Success Indicators

### ✅ When Everything is Working
- Server starts without errors
- Client loads at http://localhost:5173
- API status returns `{"status":"running"}`
- Queue status shows all queues at zero
- Frontend can make API calls successfully
- Database creates `database.sqlite` file

### 📊 Monitoring
- **Queue Status**: http://localhost:5001/admin/queues
- **API Health**: http://localhost:5001/api/status
- **Frontend**: http://localhost:5173
- **Server Logs**: Check terminal where server is running

---

## 🔄 Daily Usage Workflow

### 1. Start Application
```bash
cd /Users/allansmeyatsky/outbound/gear-link-app
./start.sh
```

### 2. Scrape New Leads
- Visit frontend
- Enter target city
- Start scraping job
- Monitor in queue status

### 3. Review & Outreach
- Check discovered leads
- Select quality leads
- Start outreach campaign
- Monitor responses

### 4. Track Progress
- Check reply status
- Monitor campaign performance
- Review queue processing

---

## 📞 Support & Maintenance

### Regular Tasks
- **Daily**: Start application, check queue status
- **Weekly**: Review lead quality, update API keys if needed
- **Monthly**: Clean up old leads, check database size

### Logs & Monitoring
- **Server Logs**: Terminal output
- **Queue Status**: `/admin/queues` endpoint
- **Database**: `database.sqlite` file

### Backups
- **Database**: Backup `database.sqlite` regularly
- **Configuration**: Save `.env` file securely
- **Code**: Git repository with full history

---

## 🎯 You're Ready to Go!

Your **Gear-Link Outbound Automation Suite** is now fully operational and ready to help you:
- ✅ Discover rental shops automatically
- ✅ Generate personalized outreach with AI
- ✅ Send automated email campaigns
- ✅ Track responses and manage follow-ups
- ✅ Monitor everything through the dashboard

**Start your first campaign today!** 🚀

---

*Created by: Allan Smeyatsky*  
*Version: 1.0.0*  
*Status: Production Ready*  
*Last Updated: February 8, 2026*