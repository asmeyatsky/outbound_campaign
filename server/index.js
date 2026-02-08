require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initDb, db } = require('./db');
const { searchShops, getPlaceDetails, findEmailOnWebsite } = require('./scraper');
const { scraperQueue, outreachQueue, monitorQueue } = require('./queue');
const { getAuthUrl, getTokens, sendEmail } = require('./gmail');
// Bull Board removed - using simple queue system

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Simple queue status endpoint
app.get('/admin/queues', (req, res) => {
    const scraperJobs = scraperQueue.getJobs();
    const outreachJobs = outreachQueue.getJobs();
    const monitorJobs = monitorQueue.getJobs();
    
    res.json({
        scraper: {
            total: scraperJobs.length,
            waiting: scraperJobs.filter(j => j.status === 'waiting').length,
            processing: scraperJobs.filter(j => j.status === 'processing').length,
            completed: scraperJobs.filter(j => j.status === 'completed').length,
            failed: scraperJobs.filter(j => j.status === 'failed').length
        },
        outreach: {
            total: outreachJobs.length,
            waiting: outreachJobs.filter(j => j.status === 'waiting').length,
            processing: outreachJobs.filter(j => j.status === 'processing').length,
            completed: outreachJobs.filter(j => j.status === 'completed').length,
            failed: outreachJobs.filter(j => j.status === 'failed').length
        },
        monitor: {
            total: monitorJobs.length,
            waiting: monitorJobs.filter(j => j.status === 'waiting').length,
            processing: monitorJobs.filter(j => j.status === 'processing').length,
            completed: monitorJobs.filter(j => j.status === 'completed').length,
            failed: monitorJobs.filter(j => j.status === 'failed').length
        }
    });
});

// Scraper Route
app.post('/api/scrape', async (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        const job = await scraperQueue.add(`scrape-${city}`, { city });
        res.json({ message: `Scraping job queued with ID ${job.id}`, jobId: job.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth Routes
let userTokens = null; // In a real app, store this in DB per user

app.get('/api/auth/google', (req, res) => {
    res.redirect(getAuthUrl());
});

app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        userTokens = await getTokens(code);

        // Start monitoring job once authenticated (runs every hour)
        await monitorQueue.add('check-responses', { tokens: userTokens }, {
            repeat: { every: 3600000 }
        });

        res.send('Authentication successful! Monitoring started. You can close this tab.');
    } catch (error) {
        res.status(500).send('Authentication failed.');
    }
});

// Unsubscribe Route
app.get('/api/unsubscribe', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).send('Email is required');

    try {
        await db('leads').where({ email }).update({ status: 'unsubscribed' });
        res.send('You have been successfully unsubscribed.');
    } catch (error) {
        res.status(500).send('Error processing unsubscribe request.');
    }
});

// Outreach Route
app.post('/api/outreach', async (req, res) => {
    const { leadIds } = req.body;
    if (!leadIds || !leadIds.length) return res.status(400).json({ error: 'Lead IDs are required' });
    if (!userTokens) return res.status(401).json({ error: 'Not authenticated with Google' });

    try {
        for (const id of leadIds) {
            const lead = await db('leads').where({ id }).first();
            if (lead && lead.email && lead.status !== 'sent') {
                await outreachQueue.add(`outreach-${id}`, {
                    leadId: id,
                    tokens: userTokens
                });
                await db('leads').where({ id }).update({ status: 'in_campaign' });
            }
        }
        res.json({ message: `${leadIds.length} outreach jobs queued.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Leads Route
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await db('leads').select('*').orderBy('created_at', 'desc');
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Main entry point
app.get('/api/status', (req, res) => {
    res.json({ status: 'running', version: '1.0.0' });
});

// Start Server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
