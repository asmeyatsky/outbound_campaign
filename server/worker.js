const { scraperQueue, outreachQueue, monitorQueue } = require('./queue');
const { searchShops, getPlaceDetails, findEmailOnWebsite } = require('./scraper');
const { generatePersonalizedHook } = require('./llm');
const { sendEmail } = require('./gmail');
const { checkThreadForReply } = require('./gmail-tracker');
const { db } = require('./db');
const puppeteer = require('puppeteer');

// Scraper Worker Processor
async function processScraperJob(job) {
    const { city } = job.data;
    console.log(`Working on scrape job for ${city}`);

    try {
        const shops = await searchShops(city);
        let browser;

        try {
            browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();

            for (const shop of shops) {
                const details = await getPlaceDetails(shop.place_id);
                if (details && details.website) {
                    const email = await findEmailOnWebsite(details.website);

                    let aiHook = null;
                    if (email) {
                        // Get some content from the site for AI personalization
                        try {
                            await page.goto(details.website, { waitUntil: 'networkidle2', timeout: 15000 });
                            const content = await page.evaluate(() => document.body.innerText);
                            aiHook = await generatePersonalizedHook(shop.name, content);
                        } catch (e) {
                            console.warn(`Could not get content for AI hook for ${shop.name}`);
                        }
                    }

                    await db('leads').insert({
                        name: shop.name,
                        website: details.website,
                        phone: details.formatted_phone_number,
                        address: shop.address,
                        rating: shop.rating,
                        email: email,
                        city: city,
                        status: email ? 'contact_found' : 'no_contact',
                        ai_hook: aiHook
                    });
                }
            }
        } finally {
            if (browser) await browser.close();
        }
    } catch (error) {
        console.error(`Scraper job ${job.id} failed:`, error);
        throw error;
    }
}

// Outreach Worker Processor
async function processOutreachJob(job) {
    const { leadId, tokens, isFollowup } = job.data;
    const lead = await db('leads').where({ id: leadId }).first();

    if (!lead || !lead.email || lead.status === 'unsubscribed') return;

    const subject = isFollowup
        ? `Re: Listing ${lead.name} on the new Gear Rental Marketplace`
        : `Listing ${lead.name} on the new Gear Rental Marketplace`;

    const body = isFollowup
        ? `Hi ${lead.name} team,<br><br>Just following up on my previous note. We'd love to help you monetize your idle gear. Any interest in a quick chat?<br><br>Best,<br>Allan`
        : `
    Hi there,<br><br>
    I'm Allan, founder of a new P2P gear rental platform. 
    ${lead.ai_hook || `I noticed ${lead.name} has an impressive inventory.`}<br><br>
    We want to help you <b>monetize your idle inventory</b> by putting it in front of local creators. 
    We have a bulk upload tool ready so you can list your entire catalog in minutes.<br><br>
    Check out our staging environment here: <a href="https://smeyatsky.com/gear-staging">https://smeyatsky.com/gear-staging</a><br><br>
    Best,<br>
    Allan<br><br>
    <small><i>If you'd rather not hear from us, <a href="${process.env.APP_URL || 'http://localhost:5000'}/api/unsubscribe?email=${encodeURIComponent(lead.email)}">click here to unsubscribe</a> and we will remove ${lead.name} immediately.</i></small>
  `;

    try {
        const result = await sendEmail(tokens, lead.email, subject, body);

        await db('leads').where({ id: leadId }).update({
            status: isFollowup ? 'followup_sent' : 'sent'
        });

        await db('campaigns').insert({
            lead_id: leadId,
            status: isFollowup ? 'followup_sent' : 'sent',
            thread_id: result.threadId,
            sent_at: db.fn.now()
        });

        console.log(`${isFollowup ? 'Follow-up' : 'Email'} sent to ${lead.email}`);
    } catch (error) {
        console.error(`Failed to send email to ${lead.email}:`, error);
        await db('leads').where({ id: leadId }).update({ status: 'failed' });
        throw error;
    }
}

// Monitor Worker Processor (Runs every hour to check responses and trigger follow-ups)
async function processMonitorJob(job) {
    const { tokens } = job.data;
    console.log('Running monitor job...');

    const activeCampaigns = await db('campaigns').whereIn('status', ['sent', 'followup_sent']);

    for (const campaign of activeCampaigns) {
        const hasReply = await checkThreadForReply(tokens, campaign.thread_id);

        if (hasReply) {
            await db('campaigns').where({ id: campaign.id }).update({ status: 'replied' });
            await db('leads').where({ id: campaign.lead_id }).update({ status: 'replied' });
            console.log(`Lead ${campaign.lead_id} replied!`);
        } else {
            // Logic for automated follow-up (e.g., after 3 days)
            const sentAt = new Date(campaign.sent_at);
            const now = new Date();
            const diffDays = Math.ceil(Math.abs(now - sentAt) / (1000 * 60 * 60 * 24));

            if (diffDays >= 3 && campaign.status === 'sent') {
                // Trigger follow-up if not already done
                await outreachQueue.add(`followup-${campaign.lead_id}`, {
                    leadId: campaign.lead_id,
                    tokens,
                    isFollowup: true
                });
                console.log(`Queued follow-up for lead ${campaign.lead_id}`);
            }
        }
    }
}

// Set up processors for each queue
scraperQueue.setProcessor(processScraperJob);
outreachQueue.setProcessor(processOutreachJob);
monitorQueue.setProcessor(processMonitorJob);

console.log('Workers started...');
