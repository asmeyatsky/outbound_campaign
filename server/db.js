const knex = require('knex');
const path = require('path');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
});

async function initDb() {
    const hasLeadsTable = await db.schema.hasTable('leads');
    if (!hasLeadsTable) {
        await db.schema.createTable('leads', table => {
            table.increments('id').primary();
            table.string('name');
            table.string('website');
            table.string('phone');
            table.string('address');
            table.float('rating');
            table.string('email');
            table.string('city');
            table.string('country');
            table.string('status').defaultTo('new'); // new, in_campaign, contact_found, no_contact
            table.text('ai_hook');
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    }

    const hasCampaignsTable = await db.schema.hasTable('campaigns');
    if (!hasCampaignsTable) {
        await db.schema.createTable('campaigns', table => {
            table.increments('id').primary();
            table.integer('lead_id').references('leads.id');
            table.string('status').defaultTo('queued'); // queued, sent, opened, clicked, replied, bounced
            table.string('thread_id');
            table.timestamp('sent_at');
            table.timestamp('last_activity_at');
        });
    }
}

module.exports = { db, initDb };
