import {createClient} from "redis";
import {RateLimiterRedis} from "rate-limiter-flexible";

const redisClient = createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
})

const opts = {
    storeClient: redisClient,
    points: 10, // 6 points
    duration: 60, // Per second
    blockDuration: 60,
};

const rateLimiter = new RateLimiterRedis(opts);

export const rateLimitRequest = async (sessionId: string) => {
    try {
        await redisClient.connect();
        await rateLimiter.consume(sessionId, 1);
    } catch (error) {
        throw new Error('Rate Limit exceeded');
    }
}