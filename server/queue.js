const { Queue, Worker, QueueEvents } = require('bullmq');
const IORedis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

const scraperQueue = new Queue('scraper-jobs', { connection });
const outreachQueue = new Queue('outreach-jobs', { connection });
const monitorQueue = new Queue('monitor-jobs', { connection });

module.exports = {
    scraperQueue,
    outreachQueue,
    monitorQueue,
    connection
};
