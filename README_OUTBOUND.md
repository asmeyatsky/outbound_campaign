# Gear-Link Outbound Automation Suite

🎯 **Location**: `/Users/allansmeyatsky/outbound/gear-link-app/`

## 🚀 Quick Start

```bash
# Option 1: Use the launch script
cd /Users/allansmeyatsky/outbound/gear-link-app
./start.sh

# Option 2: Start manually
# Terminal 1 - Server:
cd /Users/allansmeyatsky/outbound/gear-link-app/server && npm start

# Terminal 2 - Client:
cd /Users/allansmeyatsky/outbound/gear-link-app/client && npm run dev
```

## 📱 Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001  
- **Queue Status**: http://localhost:5001/admin/queues

## ⚙️ Setup Required
1. Copy `/Users/allansmeyatsky/outbound/gear-link-app/server/.env.example` to `.env`
2. Add your API keys (Google Places, Google OAuth, OpenAI)
3. Run `npm install` in both `server/` and `client/` directories

## 📋 Project Status
✅ **Fully Functional** - Audited, tested, and ready for production use!

### Features Working
- ✅ Intelligent scraper (Google Places + Puppeteer)
- ✅ AI personalization (OpenAI GPT-4o)  
- ✅ Gmail automation (OAuth 2.0 + API)
- ✅ Queue management (In-memory, no Redis needed!)
- ✅ Admin dashboard (React + Tailwind CSS)
- ✅ SQLite database (Local, free)

---
**Moved by**: Allan Smeyatsky  
**Date**: February 8, 2026  
**Status**: ✅ Production Ready