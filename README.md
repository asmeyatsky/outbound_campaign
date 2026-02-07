# Gear-Link Outbound Automation Suite

An AI-powered, full-stack lead generation and outreach platform designed for gear rental marketplaces.

## 🚀 Overview
Gear-Link automates the discovery of professional rental shops, enriches them with contact details, and executes high-converting, personalized outreach campaigns using OpenAI and Gmail.

## ✨ Features
- **Intelligent Scraper**: Scrapes Google Places API for rental shops in any target city.
- **AI Personalization**: Uses GPT-4o to analyze shop websites and write unique, context-aware email hooks.
- **Automated Outreach**: Secure Gmail API integration with automated follow-up logic.
- **Response Tracking**: Automatically detects replies and updates lead statuses.
- **Task Management**: Powered by BullMQ and Redis for high-performance background processing.
- **Admin Dashboard**: Premium React dashboard with glassmorphic aesthetics.
- **Queue Monitoring**: Built-in Bull Board UI for monitoring background workers.

## 🛠 Tech Stack
- **Frontend**: Vite + React + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express + SQLite + Knex
- **Automation**: BullMQ + Redis + Puppeteer
- **AI**: OpenAI API (GPT-4o)
- **Auth**: Google OAuth 2.0 (Gmail API)

## 📦 Project Structure
- `/client`: React frontend source code.
- `/server`: Express backend, background workers, and business logic.
- `/brain`: Project planning and documentation artifacts.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Redis (`brew install redis`)
- Google Cloud Project with Gmail API enabled
- OpenAI API Key

### Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   GOOGLE_PLACES_API_KEY=your_key
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   OPENAI_API_KEY=your_key
   REDIS_URL=redis://127.0.0.1:6379
   ```
4. Start the server: `npm start`
5. Start the workers: `node worker.js`

### Frontend Setup
1. `cd client`
2. `npm install`
3. Start the dev server: `npm run dev`
4. Access the dashboard at `http://localhost:5173`

## 📊 Roadmap Implementation
All roadmap features have been successfully implemented:
- [x] Task Queues (BullMQ/Redis)
- [x] LLM Personalization (OpenAI)
- [x] Gmail OAuth2 & Outreach Logic
- [x] Automated Follow-ups & Response Tracking
- [x] Unsubscribe Webhook Logic

## ⚖️ Ethics & Compliance
Includes built-in unsubscribe logic and volume control capabilities to ensure compliance with GDPR, POPIA, and CAN-SPAM regulations.

---
Created by Allan Smeyatsky.
