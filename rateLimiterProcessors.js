// Inits toekn buckets
export function initializeTokenBuckets(tokenBuckets, config) {
    for (const value of config.rateLimitsPerEndpoint) {
        tokenBuckets[value.endpoint] = {
            burst: value.burst,
            sustained: value.sustained,
            tokens: parseInt(Math.max(0, value.burst)),
            lastRefillTime: Date.now(),
        };
    }
}

// Refill tokens for a given endpoint
export function refillTokens(tokenBuckets, endpoint) {
    const bucket = tokenBuckets[endpoint];
    const currentTime = Date.now();
    const timePassed = (currentTime - bucket.lastRefillTime) / 1000;

    // Calculates tokens to refill based on bucket sustained rate
    const tokensToRefill = (timePassed * bucket.sustained) / 60;
    bucket.tokens = Math.min(bucket.tokens + tokensToRefill, bucket.burst);

    // Updates last refill time
    bucket.lastRefillTime = currentTime;
}