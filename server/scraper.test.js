const nock = require('nock');
const { searchShops } = require('./scraper');

describe('Scraper Service', () => {
    beforeEach(() => {
        process.env.GOOGLE_PLACES_API_KEY = 'test-key';
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test('searchShops should return formatted results from Google Places API', async () => {
        nock('https://maps.googleapis.com')
            .get('/maps/api/place/textsearch/json')
            .query(true)
            .reply(200, {
                results: [
                    {
                        name: 'Test Shop',
                        formatted_address: '123 Test St',
                        rating: 4.5,
                        place_id: 'place_123'
                    }
                ]
            });

        const results = await searchShops('London');
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Test Shop');
        expect(results[0].place_id).toBe('place_123');
    });

    test('searchShops should handle API errors gracefully', async () => {
        nock('https://maps.googleapis.com')
            .get('/maps/api/place/textsearch/json')
            .query(true)
            .reply(500);

        const results = await searchShops('London');
        expect(results).toEqual([]);
    });
});
