const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { searchShops, getPlaceDetails, findEmailOnWebsite } = require('./scraper');
const { generatePersonalizedHook } = require('./llm');
const { sendEmail } = require('./gmail');
const { db } = require('./db');
const puppeteer = require('puppeteer');

// Scraper Worker
const scraperWorker = new Worker('scraper-jobs', async job => {
    const { city } = job.data;
    console.log(`Working on scrape job for ${city}`);

    try {
        const shops = await searchShops(city);
        let browser;

        try {
            browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();

            for (const shop of shops) {
                // Update progress
                await job.updateProgress((shops.indexOf(shop) / shops.length) * 100);

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
}, { connection });

// Outreach Worker
const outreachWorker = new Worker('outreach-jobs', async job => {
    const { leadId, tokens } = job.data;
    const lead = await db('leads').where({ id: leadId }).first();

    if (!lead || !lead.email) return;

    const subject = `Listing ${lead.name} on the new Gear Rental Marketplace`;
    const body = `
    Hi there,<br><br>
    I’m Allan, founder of a new P2P gear rental platform. 
    ${lead.ai_hook || `I noticed ${lead.name} has an impressive inventory.`}<br><br>
    We want to help you <b>monetize your idle inventory</b> by putting it in front of local creators. 
    We have a bulk upload tool ready so you can list your entire catalog in minutes.<br><br>
    Check out our staging environment here: <a href="https://smeyatsky.com/gear-staging">https://smeyatsky.com/gear-staging</a><br><br>
    Best,<br>
    Allan<br><br>
    <small><i>If you'd rather not hear from us, reply 'Unsubscribe' and we will remove ${lead.name} immediately.</i></small>
  `;

    try {
        const result = await sendEmail(tokens, lead.email, subject, body);

        await db('leads').where({ id: leadId }).update({
            status: 'sent'
        });

        await db('campaigns').insert({
            lead_id: leadId,
            status: 'sent',
            thread_id: result.threadId,
            sent_at: db.fn.now()
        });

        console.log(`Email sent to ${lead.email} for ${lead.name}`);
    } catch (error) {
        console.error(`Failed to send email to ${lead.email}:`, error);
        await db('leads').where({ id: leadId }).update({ status: 'failed' });
        throw error;
    }
}, { connection });

console.log('Workers started...');
