const axios = require('axios');
const puppeteer = require('puppeteer');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function searchShops(city, query = 'camera rental') {
    const fullQuery = `${query} in ${city}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(fullQuery)}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            place_id: place.place_id
        }));
    } catch (error) {
        console.error('Error fetching shops:', error);
        return [];
    }
}

async function getPlaceDetails(placeId) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,website,formatted_phone_number&key=${GOOGLE_PLACES_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
}

async function findEmailOnWebsite(url) {
    if (!url) return null;

    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Simple email regex search in page content
        const content = await page.content();
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const emails = content.match(emailRegex) || [];

        // Filter out common false positives and duplicates
        const forbidden = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'wixpress.com'];
        const validEmails = [...new Set(emails.filter(e => !forbidden.some(f => e.toLowerCase().endsWith(f))))];

        return validEmails[0] || null;
    } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
        return null;
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { searchShops, getPlaceDetails, findEmailOnWebsite };
