import { redisHost, redisPort } from './keys.js';
import Redis from 'ioredis';

const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
});

const sub = new Redis({
    host: redisHost,
    port: redisPort,
});

// Calculating the Fibonacci 
function fib(index, memo = {}) {
    if (index in memo) {
        return memo[index];
    }

    if (index < 2) {
        return 1;
    }

    const result = fib(index - 1, memo) + fib(index - 2, memo);
    memo[index] = result;
    return result;
}

sub.on('message', async (channel, message) => {
    const fibResult = fib(parseInt(message));
    await redisClient.hset('values', message, fibResult);
});

sub.subscribe('insert');
