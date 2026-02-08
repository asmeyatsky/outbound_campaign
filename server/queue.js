// Using simple in-memory queue system instead of BullMQ/Redis
const { scraperQueue, outreachQueue, monitorQueue } = require('./simple-queue');

module.exports = {
    scraperQueue,
    outreachQueue,
    monitorQueue
};
