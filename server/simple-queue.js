// Simple in-memory queue system to replace BullMQ/Redis
const EventEmitter = require('events');

class SimpleQueue extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        this.jobs = [];
        this.processing = false;
        this.processor = null;
    }

    async add(jobName, data, options = {}) {
        const job = {
            id: Date.now() + Math.random(),
            name: jobName,
            data: data,
            status: 'waiting',
            createdAt: new Date(),
            options: options
        };

        this.jobs.push(job);
        
        if (options.delay) {
            setTimeout(() => this.processNext(), options.delay);
        } else {
            setImmediate(() => this.processNext());
        }

        return job;
    }

    setProcessor(processor) {
        this.processor = processor;
    }

    async processNext() {
        if (this.processing || !this.processor || this.jobs.length === 0) {
            return;
        }

        this.processing = true;
        const job = this.jobs.find(j => j.status === 'waiting');
        
        if (!job) {
            this.processing = false;
            return;
        }

        job.status = 'processing';
        this.emit('processing', job);

        try {
            await this.processor(job);
            job.status = 'completed';
            this.emit('completed', job);
        } catch (error) {
            job.status = 'failed';
            job.error = error.message;
            this.emit('failed', job);
        }

        // Remove completed/failed jobs after a delay
        setTimeout(() => {
            const index = this.jobs.indexOf(job);
            if (index > -1) {
                this.jobs.splice(index, 1);
            }
        }, 5000);

        this.processing = false;
        
        // Process next job
        setImmediate(() => this.processNext());
    }

    getJobs() {
        return this.jobs;
    }

    async close() {
        this.jobs = [];
        this.removeAllListeners();
    }
}

// Create queue instances
const scraperQueue = new SimpleQueue('scraper');
const outreachQueue = new SimpleQueue('outreach');
const monitorQueue = new SimpleQueue('monitor');

module.exports = {
    SimpleQueue,
    scraperQueue,
    outreachQueue,
    monitorQueue
};