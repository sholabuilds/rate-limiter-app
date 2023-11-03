import express from 'express';
import fs from 'fs';
import { refillTokens, initializeTokenBuckets } from './rateLimiterProcessors.js';

const app = express();
const port = process.env.PORT || 3000;
// Loads config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Token buckets
const tokenBuckets = {};

// Middleware to perform rate limiting
app.use((req, res, next) => {
    try {

        let endpoint = req.query.endpoint || req.params.endpoint || (req.body && req.body.endpoint);

        if (!endpoint) {
            return res.status(400).json({ message: 'Missing endpoint query parameter' });
        }

        // Formats the endpoint to remove the weird '+' char I'm getting when I type endpoint url in browser
        endpoint = endpoint.replace(/\+/g, ' ');

        // If endpoint in tokenBuckets
        // Refill token and decrease token amount
        if (tokenBuckets.hasOwnProperty(endpoint)) {
            refillTokens(tokenBuckets, endpoint);
            if (tokenBuckets[endpoint].tokens >= 1) {
                tokenBuckets[endpoint].tokens--;
                next();
            } else {
                res.status(429).json({ remainingTokens: 0, message: 'Rate limit exceeded. Request rejected.' });
            }
        } else {
            next();
        }
    } catch (error) {
        console.error('Error in rateLimiterMiddleware:', error);
        res.status(500).json({ message: 'Oh no! Server Error' });
    }
});


// Endpoint to check rate limit for a specific route template
app.get('/take', (req, res) => {
    try {
        let endpoint = req.query.endpoint;
        if (!endpoint) {
            // Handle missing endpoint query parameter
            return res.status(400).json({ message: 'Missing endpoint query parameter' });
        }

        // Formats the endpoint to remove the weird '+' char I'm getting when I type endpoint url in browser
        endpoint = endpoint.replace(/\+/g, ' ');

        // If endpoint in tokenBuckets
        // Return successful response
        if (tokenBuckets.hasOwnProperty(endpoint)) {
            refillTokens(tokenBuckets, endpoint);
            res.json({ remainingTokens: parseInt(tokenBuckets[endpoint].tokens), message: 'Request accepted' });
        } else {
            res.status(400).json({ message: 'Invalid endpoint' });
        }
    } catch (error) {
        console.error('Oh no! There is an Error in /take endpoint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Rate limiter is running on port ${port}`);
    initializeTokenBuckets(tokenBuckets, config);
});
