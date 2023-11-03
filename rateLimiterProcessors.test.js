import { expect } from 'chai';
import { initializeTokenBuckets, refillTokens } from './rateLimiterProcessors.js';

describe('Token Bucket Tests', () => {
    let tokenBuckets = {};

    beforeEach(() => {
        // Reset tokenBuckets before each test
        tokenBuckets = {};
    });

    describe('initializeTokenBuckets', () => {
        it('should initialize token buckets correctly', () => {
            const config = {
                rateLimitsPerEndpoint: [
                    { endpoint: 'endpoint1', burst: 100, sustained: 10 },
                    { endpoint: 'endpoint2', burst: 50, sustained: 5 },
                ],
            };

            initializeTokenBuckets(tokenBuckets, config);

            expect(tokenBuckets.endpoint1.tokens).to.equal(100);
            expect(tokenBuckets.endpoint2.tokens).to.equal(50);
        });

        it('should not initialize tokens below zero', () => {
            const config = {
                rateLimitsPerEndpoint: [{ endpoint: 'endpoint3', burst: -10, sustained: -1 }],
            };

            initializeTokenBuckets(tokenBuckets, config);

            expect(tokenBuckets.endpoint3.tokens).to.equal(0);
        });
    });

    describe('refillTokens', () => {
        it('should refill tokens correctly', () => {
            const currentTime = Date.now();
            const endpoint = 'endpoint4';

            tokenBuckets[endpoint] = {
                burst: 100,
                sustained: 10,
                tokens: 50,
                lastRefillTime: currentTime,
            };

            refillTokens(tokenBuckets, endpoint);

            // (timePassed * bucket.sustained) / 60;

            // Calculate the expected tokens based on the time passed
            const timePassed = (currentTime - tokenBuckets[endpoint].lastRefillTime) / 1000;

            // Placeholder value - to be fixed later
            const expectedTokens = 50;

            expect(tokenBuckets[endpoint].tokens).to.equal(expectedTokens);
        });
    });
});
